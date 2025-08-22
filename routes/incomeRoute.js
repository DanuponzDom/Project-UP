const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');

// ดึงข้อมูลรายรับทั้งหมด
router.get('/getall', incomeController.getAllIncomes);

// ดึงข้อมูลรายรับตาม ID
router.get('/:id', incomeController.getIncomeById);

// ยอดรวมรายรับทั้งหมดตั้งแต่เริ่ม
router.get('/summary/all', incomeController.getTotalIncomeAllTime);

// ยอดรวมรายเดือน/ปี
router.get('/summary/month/:month/year/:year', incomeController.getIncomeByMonthYear);

// ยอดรวมรายปี
router.get('/summary/year/:year', incomeController.getIncomeByYear);

module.exports = router;
