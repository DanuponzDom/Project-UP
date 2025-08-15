const { Payment, Stay, Room, Admin, BillType, User, Sequelize } = require('../models'); // เพิ่ม Sequelize เข้ามา

// Helper function สำหรับจัดการ error
const handleError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

// สร้างการชำระเงินใหม่
exports.createPayment = async ({ admin_id, stay_id, water_amount, ele_amount, payment_date }) => {
  try {
    const stay = await Stay.findByPk(stay_id, { include: Room });
    if (!stay) {
      handleError("ไม่พบการเข้าพัก", 404);
    }
    if (!stay.Room) {
      handleError("ไม่พบข้อมูลห้องพักสำหรับการเข้าพักนี้", 404);
    }
    const roomPrice = parseFloat(stay.Room.room_price);

    const waterBill = await BillType.findByPk(1); // น้ำ
    const eleBill = await BillType.findByPk(2);   // ไฟ

    if (!waterBill || !eleBill) {
      handleError("ไม่พบข้อมูลประเภทบิล (น้ำ/ไฟ)", 404);
    }

    const water_price = water_amount * parseFloat(waterBill.billtype_price);
    const ele_price = ele_amount * parseFloat(eleBill.billtype_price);

    const payment_total = water_price + ele_price + roomPrice;

    const newPayment = await Payment.create({
      admin_id,
      stay_id,
      water_amount,
      water_price,
      ele_amount,
      ele_price,
      payment_total,
      payment_date,
      payment_status: '0',
    });
    return newPayment;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

// ดึงข้อมูลการชำระเงินทั้งหมด พร้อมดึง admin_name, user_name, room_num แบบ Flattened
exports.getAllPayments = async () => {
  try {
    return await Payment.findAll({
      attributes: [
        'payment_id',
        // ดึง admin_name จาก Admin model และเปลี่ยนชื่อ key เป็น 'admin_name'
        [Sequelize.col('Admin.admin_name'), 'admin_name'],
        // ดึง user_name จาก User model (ผ่าน Stay) และเปลี่ยนชื่อ key เป็น 'user_name'
        [Sequelize.col('Stay.User.user_name'), 'user_name'],
        // ดึง room_num จาก Room model (ผ่าน Stay) และเพิ่มเป็น key 'room_num'
        [Sequelize.col('Stay.Room.room_num'), 'room_num'],
        'water_amount',
        'water_price',
        'ele_amount',
        'ele_price',
        'payment_total',
        'payment_date',
        'payment_status'
      ],
      include: [
        {
          model: Stay,
          attributes: [], // ไม่ต้องการดึง attributes ของ Stay โดยตรง
          include: [
            {
              model: Room,
              attributes: [] // ไม่ต้องการดึง attributes ของ Room โดยตรง
            },
            {
              model: User,
              attributes: [] // ไม่ต้องการดึง attributes ของ User โดยตรง
            }
          ]
        },
        {
          model: Admin,
          attributes: [] // ไม่ต้องการดึง attributes ของ Admin โดยตรง
        }
      ]
    });
  } catch (error) {
    console.error("Error getting all payments:", error);
    throw error;
  }
};

// ดึงข้อมูลการชำระเงินตาม ID พร้อมดึง admin_name, user_name, room_num แบบ Flattened
exports.getPaymentById = async (id) => {
  try {
    const payment = await Payment.findByPk(id, {
      attributes: [
        'payment_id',
        [Sequelize.col('Admin.admin_name'), 'admin_name'],
        [Sequelize.col('Stay.User.user_name'), 'user_name'],
        [Sequelize.col('Stay.Room.room_num'), 'room_num'],
        'water_amount',
        'water_price',
        'ele_amount',
        'ele_price',
        'payment_total',
        'payment_date',
        'payment_status'
      ],
      include: [
        {
          model: Stay,
          attributes: [],
          include: [
            {
              model: Room,
              attributes: []
            },
            {
              model: User,
              attributes: []
            }
          ]
        },
        {
          model: Admin,
          attributes: []
        }
      ]
    });
    if (!payment) {
      handleError("ไม่พบข้อมูลการชำระ", 404);
    }
    return payment;
  } catch (error) {
    console.error("Error getting payment by ID:", error);
    throw error;
  }
};

// อัปเดตข้อมูลการชำระเงิน
exports.updatePayment = async (id, data) => {
  try {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      handleError("ไม่พบข้อมูลการชำระ", 404);
    }

    if (data.water_amount !== undefined || data.ele_amount !== undefined) {
      const waterBill = await BillType.findByPk(1);
      const eleBill = await BillType.findByPk(2);

      if (!waterBill || !eleBill) {
        handleError("ไม่พบข้อมูลประเภทบิล (น้ำ/ไฟ) สำหรับการคำนวณใหม่", 404);
      }

      const water_price = (data.water_amount ?? payment.water_amount) * parseFloat(waterBill.billtype_price);
      const ele_price = (data.ele_amount ?? payment.ele_amount) * parseFloat(eleBill.billtype_price);

      const stay = await Stay.findByPk(payment.stay_id, { include: Room });
      if (!stay || !stay.Room) {
        handleError("ไม่พบการเข้าพักหรือข้อมูลห้องพักสำหรับการคำนวณใหม่", 404);
      }
      const roomPrice = parseFloat(stay.Room.room_price);

      data.water_price = water_price;
      data.ele_price = ele_price;
      data.payment_total = water_price + ele_price + roomPrice;
    }

    await payment.update(data);
    return payment;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};

// ลบข้อมูลการชำระเงิน
exports.deletePayment = async (id) => {
  try {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      handleError("ไม่พบข้อมูลการชำระ", 404);
    }
    await payment.destroy();
    return true;
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw error;
  }
};
