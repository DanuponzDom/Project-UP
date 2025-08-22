const express = require('express');
const router = express.Router();
const notificationRepairController = require('../controllers/notificationRepairController');

// ดึง notification ทั้งหมด
router.get('/getall', notificationRepairController.getAll);

// ดึง notification ของ user
router.get('/user/:user_id', notificationRepairController.getByUser);

// ดึง notification ของ admin
router.get('/admin/:admin_id', notificationRepairController.getByAdmin);

// ทำเครื่องหมายว่าอ่านแล้ว
router.put('/markread/:notification_id', notificationRepairController.markRead);

module.exports = router;