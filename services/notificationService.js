const Notification = require('../models/notification');
const User = require('../models/user');

// สร้าง notification
exports.createNotification = async ({ user_id = null, title, message }) => {
  try {
    return await Notification.create({ user_id, title, message });
  } catch (err) {
    throw new Error('สร้าง notification ไม่สำเร็จ: ' + err.message);
  }
};

// ดึง notification ของ user
exports.getNotificationsByUser = async (user_id) => {
  try {
    return await Notification.findAll({
      where: { user_id },
      include: [{ model: User, as: 'user', attributes: ['user_name'] }],
      order: [['created_at', 'DESC']],
    });
  } catch (err) {
    throw new Error('ดึง notification ของ user ไม่สำเร็จ: ' + err.message);
  }
};

// ดึง notification ทั้งหมด (สำหรับ admin)
exports.getAllNotifications = async () => {
  try {
    return await Notification.findAll({
      include: [{ model: User, as: 'user', attributes: ['user_name'] }],
      order: [['created_at', 'DESC']],
    });
  } catch (err) {
    throw new Error('ดึง notification ทั้งหมดไม่สำเร็จ: ' + err.message);
  }
};

// ทำเครื่องหมายว่าอ่านแล้ว
exports.markAsRead = async (id) => {
  try {
    const notif = await Notification.findByPk(id);
    if (!notif) return null;
    notif.is_read = true;
    await notif.save();
    return notif;
  } catch (err) {
    throw new Error('ทำเครื่องหมายอ่านแล้วไม่สำเร็จ: ' + err.message);
  }
};
