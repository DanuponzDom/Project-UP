const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { PaymentSlip, Payment, Stay, User, Room, Notification } = require("../models");

// =================== Multer Config ===================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/slips");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `slip_${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|pdf/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) cb(null, true);
  else cb(new Error("อนุญาตเฉพาะ JPG, JPEG, PNG, PDF เท่านั้น"));
};

const upload = multer({ storage, fileFilter });

// =================== Upload Slip ===================
exports.uploadSlip = [
  upload.single("slip"),
  async (req, res) => {
    try {
      const { payment_id } = req.body;
      if (!payment_id) return res.status(400).json({ error: "กรุณาระบุ payment_id" });
      if (!req.file) return res.status(400).json({ error: "กรุณาอัปโหลดไฟล์ slip" });

      const payment = await Payment.findByPk(payment_id, {
        include: [{
          model: Stay,
          include: [User, Room]
        }]
      });

      if (!payment || !payment.Stay) return res.status(404).json({ error: "ไม่พบ payment หรือ stay" });

      const slip_url = `/uploads/slips/${req.file.filename}`;

      const slip = await PaymentSlip.create({
        payment_id,
        stay_id: payment.stay_id,
        user_id: payment.Stay.User.user_id,
        slip_url
      });

      await Notification.create({
        user_id: null,
        title: "มีการอัปโหลดสลิปใหม่",
        message: `ผู้ใช้ห้อง ${payment.Stay.Room.room_num} ได้อัปโหลดสลิป`
      });

      res.status(201).json({ message: "อัปโหลดสลิปสำเร็จ", slip });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
];

// =================== Get All Slips ===================
exports.getAllSlips = async (req, res) => {
  try {
    const slips = await PaymentSlip.findAll({
      order: [["uploaded_at", "DESC"]]
    });
    res.json(slips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
