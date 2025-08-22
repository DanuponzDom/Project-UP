const { Expense, Admin } = require('../models');
const { Op } = require('sequelize');

// =================== CRUD ===================

// ดึงข้อมูลทั้งหมด
exports.getAllExpenses = async () => {
  const expenses = await Expense.findAll({
    include: { model: Admin, attributes: ['admin_name'] },
    order: [['expense_date', 'DESC']]
  });

  return expenses.map(exp => ({
    expense_id: exp.expense_id,
    expense_type: exp.expense_type,
    expense_price: exp.expense_price,
    expense_date: exp.expense_date,
    admin_name: exp.Admin?.admin_name || null
  }));
};

// ดึงข้อมูลตาม ID
exports.getExpenseById = async (id) => {
  const exp = await Expense.findByPk(id, {
    include: { model: Admin, attributes: ['admin_name'] }
  });

  if (!exp) return null;

  return {
    expense_id: exp.expense_id,
    expense_type: exp.expense_type,
    expense_price: exp.expense_price,
    expense_date: exp.expense_date,
    admin_name: exp.Admin?.admin_name || null
  };
};

// สร้างรายการ
exports.createExpense = async (data) => {
  const expense = await Expense.create(data);
  return await exports.getExpenseById(expense.expense_id);
};

// แก้ไขรายการ
exports.updateExpense = async (id, data) => {
  const expense = await Expense.findByPk(id);
  if (!expense) return null;
  await expense.update(data);
  return await exports.getExpenseById(id);
};

// ลบรายการ
exports.deleteExpense = async (id) => {
  const expense = await Expense.findByPk(id);
  if (!expense) return null;
  await expense.destroy();
  return expense;
};

// =================== Summary ===================

// สรุปยอดรวมทั้งหมด
exports.getTotalExpenses = async () => {
  const total = await Expense.sum('expense_price');
  return total || 0;
};

// สรุปยอดรายเดือน
exports.getMonthlyExpenses = async (month, year) => {
  const expenses = await Expense.findAll({
    where: {
      expense_date: {
        [Op.and]: [
          { [Op.gte]: `${year}-${month}-01` },
          { [Op.lte]: `${year}-${month}-31` }
        ]
      }
    }
  });

  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.expense_price), 0);
  return { month, year, total };
};

// สรุปยอดรายปี
exports.getYearlyExpenses = async (year) => {
  const expenses = await Expense.findAll({
    where: {
      expense_date: {
        [Op.and]: [
          { [Op.gte]: `${year}-01-01` },
          { [Op.lte]: `${year}-12-31` }
        ]
      }
    }
  });

  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.expense_price), 0);
  return { year, total };
};
