const express = require('express');
const router = express.Router();
const paymentSlipController = require('../controllers/paymentSlipController');

// อัปโหลดสลิป
router.post('/', paymentSlipController.uploadSlip);

// ดึงสลิปทั้งหมด
router.get('/', paymentSlipController.getAllSlips);

module.exports = router;
