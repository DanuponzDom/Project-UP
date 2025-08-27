const notificationService = require('../services/notificationService');

// ดึง notification ของ user
exports.getByUser = async (req, res) => {
  try {
    const notifications = await notificationService.getNotificationsByUser(req.params.user_id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึง notification ทั้งหมด (สำหรับ admin)
exports.getAll = async (req, res) => {
  try {
    // สำหรับ admin, เราจะดึง notification ทั้งหมด
    // โดยไม่สนใจ admin_id เพราะ model ไม่มี field นี้
    const notifications = await notificationService.getAllNotifications();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ทำเครื่องหมายว่าอ่านแล้ว
exports.markAsRead = async (req, res) => {
  try {
    const notif = await notificationService.markAsRead(req.params.id);
    if (!notif) return res.status(404).json({ error: 'ไม่พบแจ้งเตือน' });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
