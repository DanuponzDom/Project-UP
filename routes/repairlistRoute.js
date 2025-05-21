const express = require('express');
const router = express.Router();
const repairlistController = require('../controllers/repairlistController');

router.post('/create', repairlistController.create);
router.get('/getall', repairlistController.getAll);
router.get('/:id', repairlistController.getById);
router.put('/:id', repairlistController.update);
router.delete('/:id', repairlistController.delete);

module.exports = router;
