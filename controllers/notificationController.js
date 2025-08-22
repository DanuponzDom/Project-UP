const notificationService = require('../services/notificationService');

exports.getByUser = async (req, res) => {
  try {
    const notifications = await notificationService.getNotificationsByUser(req.params.user_id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notif = await notificationService.markAsRead(req.params.id);
    if (!notif) return res.status(404).json({ error: 'ไม่พบแจ้งเตือน' });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
