const expenseService = require('../services/expenseService');

exports.getAll = async (req, res) => {
  try {
    const expenses = await expenseService.getAllExpenses();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id);
    if (!expense) return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const expense = await expenseService.createExpense(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const expense = await expenseService.updateExpense(req.params.id, req.body);
    if (!expense) return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const expense = await expenseService.deleteExpense(req.params.id);
    if (!expense) return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    res.json({ message: 'ลบข้อมูลสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.total = async (req, res) => {
  try {
    const total = await expenseService.getTotalExpenses();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.monthly = async (req, res) => {
  try {
    const { month, year } = req.params;
    const summary = await expenseService.getMonthlyExpenses(month, year);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.yearly = async (req, res) => {
  try {
    const { year } = req.params;
    const summary = await expenseService.getYearlyExpenses(year);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
