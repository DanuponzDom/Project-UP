const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// ดึง notification ของ user
router.get('/user/:user_id', notificationController.getByUser);

// ดึง notification ทั้งหมด (สำหรับ admin)
router.get('/getall', notificationController.getAll);

// ทำเครื่องหมายว่าอ่านแล้ว
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
