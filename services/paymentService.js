const { Payment, Stay, Room, Admin, BillType, User, Sequelize } = require('../models');

// Helper function สำหรับจัดการ error
const handleError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

// สร้างการชำระเงินใหม่
exports.createPayment = async ({ admin_id, stay_id, water_amount = 0, ele_amount = 0, payment_insurance = 0, payment_date }) => {
  try {
    const stay = await Stay.findByPk(stay_id, { include: Room });
    if (!stay) {
      handleError("ไม่พบการเข้าพัก", 404);
    }
    if (!stay.Room) {
      handleError("ไม่พบข้อมูลห้องพักสำหรับการเข้าพักนี้", 404);
    }
    const roomPrice = parseFloat(stay.Room.room_price);

    const waterBill = await BillType.findByPk(1);
    const eleBill = await BillType.findByPk(2);
    const insuranceBill = await BillType.findByPk(4);

    if (!waterBill || !eleBill || !insuranceBill) {
      handleError("ไม่พบข้อมูลประเภทบิล (น้ำ/ไฟ/ประกัน)", 404);
    }

    // ค่าที่นำมาคูณจะใช้ค่าที่รับเข้ามา หรือ 0 ถ้าไม่ได้ระบุ
    const water_price = water_amount * parseFloat(waterBill.billtype_price);
    const ele_price = ele_amount * parseFloat(eleBill.billtype_price);
    const insurance_price = payment_insurance * parseFloat(insuranceBill.billtype_price);

    // คำนวณยอดรวมทั้งหมด: น้ำ + ไฟ + ประกัน + ค่าห้อง
    const payment_total = water_price + ele_price + insurance_price + roomPrice;

    const newPayment = await Payment.create({
      admin_id,
      stay_id,
      water_amount,
      water_price,
      ele_amount,
      ele_price,
      payment_insurance,
      insurance_price,
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
        [Sequelize.col('Admin.admin_name'), 'admin_name'],
        [Sequelize.col('Stay.User.user_name'), 'user_name'],
        [Sequelize.col('Stay.Room.room_num'), 'room_num'],
        'water_amount',
        'water_price',
        'ele_amount',
        'ele_price',
        'payment_insurance',
        'insurance_price',
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
        'payment_insurance',
        'insurance_price',
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

    // ตรวจสอบว่ามีการเปลี่ยนแปลงค่าใดๆ ที่ส่งผลต่อการคำนวณยอดรวมหรือไม่
    // หรือถ้ามีการส่งค่ามา (แม้จะเป็น 0) ก็ให้คำนวณใหม่
    if (data.water_amount !== undefined || data.ele_amount !== undefined || data.payment_insurance !== undefined) {
      const waterBill = await BillType.findByPk(1);
      const eleBill = await BillType.findByPk(2);
      const insuranceBill = await BillType.findByPk(4);

      if (!waterBill || !eleBill || !insuranceBill) {
        handleError("ไม่พบข้อมูลประเภทบิล (น้ำ/ไฟ/ประกัน) สำหรับการคำนวณใหม่", 404);
      }

      // ใช้ค่าใหม่ที่ส่งมา (data.xxx) หรือใช้ค่าเดิมที่มีอยู่ใน payment ถ้าไม่ได้ส่งมา
      // หรือถ้าส่ง null/undefined มา ก็จะใช้ค่าเดิมจาก DB หรือ 0 (ถ้าค่าเดิมใน DB เป็น 0)
      const current_water_amount = data.water_amount ?? payment.water_amount;
      const current_ele_amount = data.ele_amount ?? payment.ele_amount;
      const current_payment_insurance = data.payment_insurance ?? payment.payment_insurance;


      const water_price = current_water_amount * parseFloat(waterBill.billtype_price);
      const ele_price = current_ele_amount * parseFloat(eleBill.billtype_price);
      const insurance_price = current_payment_insurance * parseFloat(insuranceBill.billtype_price);

      const stay = await Stay.findByPk(payment.stay_id, { include: Room });
      if (!stay || !stay.Room) {
        handleError("ไม่พบการเข้าพักหรือข้อมูลห้องพักสำหรับการคำนวณใหม่", 404);
      }
      const roomPrice = parseFloat(stay.Room.room_price);

      // อัปเดตค่าราคาที่คำนวณแล้วใน data
      data.water_price = water_price;
      data.ele_price = ele_price;
      data.insurance_price = insurance_price;

      // คำนวณ payment_total ใหม่
      data.payment_total = water_price + ele_price + insurance_price + roomPrice;
    }

    await payment.update(data);
    return payment;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};

// ลบข้อมูลการชำระเงิน (เหมือนเดิม)
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
