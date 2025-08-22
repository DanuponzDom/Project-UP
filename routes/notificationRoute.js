const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// ดึงแจ้งเตือนของ user
router.get('/user/:user_id', notificationController.getByUser);

// mark read
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
