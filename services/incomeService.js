// services/incomeService.js
const { Income, Sequelize } = require('../models');
const { Op } = Sequelize;
const handleError = (msg, code=500) => { const err = new Error(msg); err.statusCode = code; throw err; };

// ดึง income ทั้งหมด
exports.getAllIncomes = async () => {
  return await Income.findAll();
};

// ดึง income ตาม ID
exports.getIncomeById = async (id) => {
  const income = await Income.findByPk(id);
  if (!income) handleError("ไม่พบ income", 404);
  return income;
};

// สร้าง income จาก payment อัตโนมัติ
exports.createIncomeFromPayment = async (payment) => {
  if(payment.payment_status !== '2') return null; // เฉพาะชำระแล้ว

  // ตรวจสอบว่า Income ของ Payment นี้มีแล้วหรือยัง
  const existing = await Income.findOne({ where: { payment_id: payment.payment_id } });
  if(existing) return existing;

  const newIncome = await Income.create({
    admin_id: payment.admin_id,
    payment_id: payment.payment_id,
    income_amount: payment.payment_total,
    income_date: payment.payment_date,
  });

  return newIncome;
};

// รวมรายรับ (filter by month/year/ปีหรือไม่ใส่ = รวมทั้งหมด)
exports.sumIncome = async ({ month, year } = {}) => {
  const where = {};
  if(month) {
    where[Sequelize.Op.and] = [
      Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('income_date')), month)
    ];
  }
  if(year) {
    if(!where[Sequelize.Op.and]) where[Sequelize.Op.and] = [];
    where[Sequelize.Op.and].push(Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('income_date')), year));
  }

  const result = await Income.sum('income_amount', { where });
  return result || 0;
};
