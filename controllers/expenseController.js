const expenseService = require('../services/expenseService');

// ดึงทั้งหมด
exports.getAll = async (req, res) => {
  try {
    const expenses = await expenseService.getAllExpenses();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึงตาม ID
exports.getById = async (req, res) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id);
    if (!expense) return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// สร้างรายการ
exports.create = async (req, res) => {
  try {
    const expense = await expenseService.createExpense(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// แก้ไขรายการ
exports.update = async (req, res) => {
  try {
    const expense = await expenseService.updateExpense(req.params.id, req.body);
    if (!expense) return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ลบรายการ
exports.delete = async (req, res) => {
  try {
    const expense = await expenseService.deleteExpense(req.params.id);
    if (!expense) return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    res.json({ message: 'ลบข้อมูลสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
