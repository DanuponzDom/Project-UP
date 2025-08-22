const NotificationRepair = require("../models/notificationRepair");

exports.createNotification = async ({ user_id = null, admin_id = null, title, message }) => {
  return await NotificationRepair.create({
    user_id,
    admin_id,
    title,
    message
  });
};

exports.getAllNotifications = async () => {
  return await NotificationRepair.findAll({
    order: [['created_at', 'DESC']]
  });
};

exports.getNotificationsByUser = async (user_id) => {
  return await NotificationRepair.findAll({
    where: { user_id },
    order: [['created_at', 'DESC']]
  });
};

exports.getNotificationsByAdmin = async (admin_id) => {
  return await NotificationRepair.findAll({
    where: { admin_id },
    order: [['created_at', 'DESC']]
  });
};

exports.markAsRead = async (notification_id) => {
  const notif = await NotificationRepair.findByPk(notification_id);
  if (!notif) return null;
  notif.read_status = true;
  await notif.save();
  return notif;
};
