const express = require('express');
const router = express.Router();
const repairController = require('../controllers/repairController');

router.post('/create', repairController.create);
router.get('/getall', repairController.getAll);
router.get('/:id', repairController.getById);
router.get('/getuser/:user_id', repairController.getByUserId);
router.put('/:id', repairController.update);
router.delete('/:id', repairController.delete);

module.exports = router;
