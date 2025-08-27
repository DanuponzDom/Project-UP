const { PaymentSlip, Payment, Stay, Notification, User, Room } = require('../models');

// อัปโหลด slip (เพิ่ม Notification ไปที่ admin)
exports.uploadSlip = async ({ payment_id, slip_url }) => {
  // ดึง Payment พร้อม Stay
  const payment = await Payment.findByPk(payment_id, {
  include: [
    {
      model: Stay,       // ไม่มี 'as'
      include: [User, Room]  // ดึงข้อมูล user/room ของ stay
    }
  ]
});

if (!payment) throw new Error('ไม่พบ payment_id');
if (!payment.Stay) throw new Error('ไม่พบข้อมูล Stay สำหรับ payment นี้');

  // สร้าง PaymentSlip
  const slip = await PaymentSlip.create({
    payment_id,
    stay_id: payment.stay_id,
    user_id: payment.Stay.user_id,
    slip_url,
  });

  // **เพิ่ม Notification ไปที่ admin**
  await Notification.create({
    user_id: null, // admin เป็นผู้รับ
    title: 'มีการอัปโหลดสลิปใหม่',
    message: `ผู้ใช้ห้อง ${payment.Stay.Room.room_num} ได้อัปโหลดสลิปการชำระเงิน`,
  });

  return slip;
};

// ดึง slip ทั้งหมด
exports.getAllSlips = async () => {
  return await PaymentSlip.findAll({
    order: [['uploaded_at', 'DESC']],
  });
};
