const paymentSlipService = require('../services/paymentSlipService');

// อัปโหลด slip
exports.upload = async (req, res) => {
  try {
    const { payment_id } = req.body;
    if (!payment_id || !req.file) {
      return res.status(400).json({ error: 'ต้องระบุ payment_id และไฟล์สลิป' });
    }

    const slip = await paymentSlipService.uploadSlip({
      payment_id,
      slip_url: req.file.path,
    });

    res.status(201).json({ message: 'อัปโหลดสลิปเรียบร้อย', slip });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ดึง slip ทั้งหมด
exports.getAll = async (req, res) => {
  try {
    const slips = await paymentSlipService.getAllSlips();
    res.json(slips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
