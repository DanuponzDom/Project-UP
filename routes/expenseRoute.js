const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/create', expenseController.create);
router.get('/getall', expenseController.getAll);
router.get('/:id', expenseController.getById);
router.put('/:id', expenseController.update);
router.delete('/:id', expenseController.delete);
// API รวมยอดค้าบบ
router.get('/summary/total', expenseController.total);
router.get('/summary/month/:month/year/:year', expenseController.monthly);
router.get('/summary/year/:year', expenseController.yearly);

module.exports = router;
