const express = require('express');
const router = express.Router();
const billTypeController = require('../controllers/billTypeController');

router.post('/create', billTypeController.create);
router.get('/getall', billTypeController.getAll);
router.get('/:id', billTypeController.getById);
router.put('/:id', billTypeController.update);
router.delete('/:id', billTypeController.remove);

module.exports = router;
