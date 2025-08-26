const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const paymentSlipController = require('../controllers/paymentSlipController');

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// อัปโหลดสลิป
router.post('/', upload.single('slip'), paymentSlipController.upload);

// ดึงสลิปทั้งหมด
router.get('/', paymentSlipController.getAll);

module.exports = router;
