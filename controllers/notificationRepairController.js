// controllers/notificationRepairController.js
const notificationService = require('../services/notificationRepairService');

// ดึง notification ทั้งหมด
exports.getAll = async (req, res) => {
  try {
    const notis = await notificationService.getAllNotifications();
    res.json(notis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ดึง notification ของ user
exports.getByUser = async (req, res) => {
  try {
    const notis = await notificationService.getNotificationsByUser(req.params.user_id);
    res.json(notis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ดึง notification ของ admin
exports.getByAdmin = async (req, res) => {
  try {
    const notis = await notificationService.getNotificationsByAdmin(req.params.admin_id);
    res.json(notis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ทำเครื่องหมายว่าอ่านแล้ว
exports.markRead = async (req, res) => {
  try {
    const notif = await notificationService.markAsRead(req.params.notification_id);
    if (!notif) return res.status(404).json({ message: 'ไม่พบ notification' });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
