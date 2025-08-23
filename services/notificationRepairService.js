const { NotificationRepair, Admin, User } = require('../models');

// ดึง Notification ทั้งหมด
exports.getAllNotifications = async () => {
  return await NotificationRepair.findAll({
    include: [
      { model: Admin, as: 'admin', attributes: ['admin_name'] },
      { model: User, as: 'user', attributes: ['user_name'] },
    ],
    order: [['created_at', 'DESC']],
  });
};

// ดึง Notification ของผู้ใช้งานหรือ admin ตาม ID
exports.getNotificationsByUserOrAdmin = async ({ user_id, admin_id }) => {
  const where = {};
  if (user_id) where.user_id = user_id;
  if (admin_id) where.admin_id = admin_id;

  return await NotificationRepair.findAll({
    where,
    include: [
      { model: Admin, as: 'admin', attributes: ['admin_name'] },
      { model: User, as: 'user', attributes: ['user_name'] },
    ],
    order: [['created_at', 'DESC']],
  });
};

// ดึง Notification ตาม ID
exports.getNotificationById = async (id) => {
  return await NotificationRepair.findByPk(id, {
    include: [
      { model: Admin, as: 'admin', attributes: ['admin_name'] },
      { model: User, as: 'user', attributes: ['user_name'] },
    ],
  });
};

// สร้าง Notification
exports.createNotification = async ({ user_id, admin_id, title, message }) => {
  console.log(user_id, admin_id, title, message)
  return await NotificationRepair.create({
    user_id,
    admin_id,
    title,
    message,
    read_status: false,
  });
};

// อัปเดตสถานะอ่าน Notification
exports.markAsRead = async (id) => {
  const notif = await NotificationRepair.findByPk(id);
  if (!notif) throw new Error('ไม่พบ Notification');
  notif.read_status = true;
  await notif.save();
  return notif;
};

// ลบ Notification
exports.deleteNotification = async (id) => {
  const notif = await NotificationRepair.findByPk(id);
  if (!notif) throw new Error('ไม่พบ Notification');
  await notif.destroy();
  return notif;
};
