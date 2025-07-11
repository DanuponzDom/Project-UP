const { Expense, Admin } = require('../models');

// ดึงข้อมูลทั้งหมด
exports.getAllExpenses = async () => {
  const expenses = await Expense.findAll({
    include: {
      model: Admin,
      attributes: ['admin_name']
    },
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

// ดึงข้อมูลรายตัว
exports.getExpenseById = async (id) => {
  const exp = await Expense.findByPk(id, {
    include: {
      model: Admin,
      attributes: ['admin_name']
    }
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
