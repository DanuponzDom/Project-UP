const notificationRepairService = require('../services/notificationRepairService');

// GET /notifications
exports.getAll = async (req, res) => {
  try {
    const notifications = await notificationRepairService.getAllNotifications();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /notifications/user?user_id=xxx หรือ /notifications/admin?admin_id=xxx
exports.getByUserOrAdmin = async (req, res) => {
  try {
    const { user_id, admin_id } = req.query;
    if (!user_id && !admin_id) {
      return res.status(400).json({ error: "ต้องระบุ user_id หรือ admin_id" });
    }
    const notifications = await notificationRepairService.getNotificationsByUserOrAdmin({ user_id, admin_id });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /notifications/:id
exports.getById = async (req, res) => {
  try {
    const notif = await notificationRepairService.getNotificationById(req.params.id);
    if (!notif) return res.status(404).json({ error: 'ไม่พบ Notification' });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /notifications
exports.create = async (req, res) => {
  try {
    const { user_id, admin_id, title, message } = req.body;
    if (!title || (!user_id && !admin_id)) {
      return res.status(400).json({ error: "ต้องระบุ title และ user_id หรือ admin_id อย่างน้อยหนึ่งค่า" });
    }
    const notif = await notificationRepairService.createNotification({ user_id, admin_id, title, message });
    res.status(201).json(notif);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PATCH /notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const notif = await notificationRepairService.markAsRead(req.params.id);
    res.json({ message: "อ่าน Notification แล้ว", notif });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /notifications/:id
exports.delete = async (req, res) => {
  try {
    const notif = await notificationRepairService.deleteNotification(req.params.id);
    res.json({ message: 'ลบ Notification เรียบร้อยแล้ว', notif });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
