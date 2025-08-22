const Notification = require('../models/notification');

exports.createNotification = async ({ user_id, title, message }) => {
  return await Notification.create({ user_id, title, message });
};