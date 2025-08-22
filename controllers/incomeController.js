// controllers/incomeController.js
const incomeService = require('../services/incomeService');

exports.getAllIncomes = async (req, res) => {
  try {
    const incomes = await incomeService.getAllIncomes();
    res.json(incomes);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

exports.getIncomeById = async (req, res) => {
  try {
    const income = await incomeService.getIncomeById(req.params.id);
    res.json(income);
  } catch (err) {
    res.status(err.statusCode || 404).json({ message: err.message });
  }
};

// ยอดรวมทั้งหมด (ตั้งแต่เริ่ม)
exports.getTotalIncomeAllTime = async (req, res) => {
  try {
    const total = await incomeService.sumIncome(); // ไม่ใส่ month/year = รวมทั้งหมด
    res.json({ total });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// ยอดรวมรายเดือน/ปี
exports.getIncomeByMonthYear = async (req, res) => {
  try {
    const { month, year } = req.params;
    const total = await incomeService.sumIncome({ month: parseInt(month), year: parseInt(year) });
    res.json({ month: parseInt(month), year: parseInt(year), total });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// ยอดรวมรายปี
exports.getIncomeByYear = async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const total = await incomeService.sumIncome({ year });
    res.json({ year, total });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
