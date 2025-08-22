const express = require('express');
const router = express.Router();
const notificationRepairController = require('../controllers/notificationRepairController');

// ดึง Notification ทั้งหมด
router.get('/getall', notificationRepairController.getAll);

// ดึง Notification ของ user หรือ admin
// ตัวอย่าง: /notifications/user?user_id=xxx หรือ /notifications/admin?admin_id=xxx
router.get('/user-or-admin', notificationRepairController.getByUserOrAdmin);

// ดึง Notification ตาม ID
router.get('/:id', notificationRepairController.getById);

// สร้าง Notification ใหม่
router.post('/create', notificationRepairController.create);

// ทำเครื่องหมายว่าอ่านแล้ว
router.patch('/:id/read', notificationRepairController.markAsRead);

// ลบ Notification
router.delete('/:id', notificationRepairController.delete);

module.exports = router;
