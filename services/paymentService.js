const { Payment, Stay, Room, Admin, BillType, User, Sequelize } = require('../models');
const incomeService = require('./incomeService');
const notificationService = require('./notificationService');

const handleError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

// ==================== CREATE PAYMENT ====================
exports.createPayment = async ({ admin_id, stay_id, water_amount = 0, ele_amount = 0, other_payment = 0, other_payment_detail = null, payment_date }) => {
  const stay = await Stay.findByPk(stay_id, { include: [Room, User] });
  if (!stay || !stay.Room || !stay.User) handleError("ไม่พบข้อมูลที่เกี่ยวข้อง", 404);

  const roomPrice = parseFloat(stay.Room.room_price);
  const waterBill = await BillType.findByPk(5);
  const eleBill = await BillType.findByPk(6);
  if (!waterBill || !eleBill) handleError("ไม่พบประเภทบิลน้ำ/ไฟ", 404);

  const water_price = water_amount * parseFloat(waterBill.billtype_price);
  const ele_price = ele_amount * parseFloat(eleBill.billtype_price);
  const payment_total = water_price + ele_price + parseFloat(other_payment) + roomPrice;

  const newPayment = await Payment.create({
    admin_id,
    stay_id,
    water_amount,
    water_price,
    ele_amount,
    ele_price,
    other_payment,
    other_payment_detail,
    payment_total,
    payment_date,
    payment_status: '1',
  });

  // ส่ง Notification แจ้ง user
  await notificationService.createNotification({
    user_id: stay.User.user_id,
    title: 'แจ้งเตือนการชำระเงินใหม่',
    message: `คุณมีค่าใช้จ่ายใหม่ จำนวน ${payment_total} บาท สำหรับห้อง ${stay.Room.room_num}`
  });

  return newPayment;
};

// ==================== GET ALL PAYMENTS ====================
exports.getAllPayments = async () => {
  return await Payment.findAll({
    attributes: [
      'payment_id',
      'stay_id',
      [Sequelize.col('Admin.admin_name'), 'admin_name'],
      [Sequelize.col('stay.User.user_id'), 'user_id'],
      [Sequelize.col('stay.User.user_name'), 'user_name'],
      [Sequelize.col('stay.Room.room_num'), 'room_num'],
      'water_amount',
      'water_price',
      'ele_amount',
      'ele_price',
      'other_payment',
      'other_payment_detail',
      'payment_total',
      'payment_date',
      'payment_status'
    ],
    include: [ { model: Stay, attributes: [], include: [{ model: Room, attributes: [] }, { model: User, attributes: [] }] }, { model: Admin, attributes: [] } ] }); };

// ==================== GET PAYMENT BY ID ====================
exports.getPaymentById = async (id) => {
  const payment = await Payment.findByPk(id, {
    attributes: [
      'payment_id',
      [Sequelize.col('Admin.admin_name'), 'admin_name'],
      [Sequelize.col('stay.User.user_name'), 'user_name'],
      [Sequelize.col('stay.Room.room_num'), 'room_num'],
      'water_amount',
      'water_price',
      'ele_amount',
      'ele_price',
      'other_payment',
      'other_payment_detail',
      'payment_total',
      'payment_date',
      'payment_status'
    ],
    include: [ 
      { model: Stay, attributes: [], include: [{ model: Room, attributes: [] }, { model: User, attributes: [] }] }, { model: Admin, attributes: [] } ] }); 
      if (!payment) handleError("ไม่พบข้อมูลการชำระ", 404); return payment; };

// ==================== UPDATE PAYMENT ====================
exports.updatePayment = async (id, data) => {
  const payment = await Payment.findByPk(id, { include: [{ model: Stay, include: [User, Room] }] });
  if (!payment) handleError("ไม่พบข้อมูลการชำระ", 404);

  const stay = payment.stay;
  if (!stay || !stay.Room) handleError("ไม่พบข้อมูลห้องพัก", 404);

  // คำนวณราคาถ้าเปลี่ยนค่า
  if (data.water_amount !== undefined || data.ele_amount !== undefined || data.other_payment !== undefined) {
    const waterBill = await BillType.findByPk(5);
    const eleBill = await BillType.findByPk(6);
    if (!waterBill || !eleBill) handleError("ไม่พบประเภทบิลน้ำ/ไฟ", 404);

    const current_water_amount = data.water_amount ?? payment.water_amount;
    const current_ele_amount = data.ele_amount ?? payment.ele_amount;
    const current_other_payment = data.other_payment ?? payment.other_payment ?? 0;

    const water_price = current_water_amount * parseFloat(waterBill.billtype_price);
    const ele_price = current_ele_amount * parseFloat(eleBill.billtype_price);
    const roomPrice = parseFloat(stay.Room.room_price);

    data.water_price = water_price;
    data.ele_price = ele_price;
    data.payment_total = water_price + ele_price + parseFloat(current_other_payment) + roomPrice;
  }

  await payment.update(data);
  await payment.reload();

  if (data.payment_status === '2') {
    await incomeService.createIncomeFromPayment(payment);
    const userId = stay.User?.user_id;
    if (userId) {
      await notificationService.createNotification({
        user_id: userId,
        title: 'แจ้งเตือนการชำระเงินใหม่',
        message: `คุณได้ชำระเงินแล้ว จำนวน ${payment.payment_total} บาท สำหรับห้อง ${stay.Room.room_num}`
      });
    }
  }

  return payment;
};

// ==================== DELETE PAYMENT ====================
exports.deletePayment = async (id) => {
  const payment = await Payment.findByPk(id);
  if (!payment) handleError("ไม่พบข้อมูลการชำระ", 404);
  await payment.destroy();
  return true;
};
