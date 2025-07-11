const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/create', expenseController.create);
router.get('/getall', expenseController.getAll);
router.get('/:id', expenseController.getById);
router.put('/:id', expenseController.update);
router.delete('/:id', expenseController.delete);

module.exports = router;
