const express = require('express');
const router = express.Router();
const stayController = require('../controllers/stayController');

router.post('/create', stayController.createStay);
router.get('/getall', stayController.getAllStays);
router.get('/:id', stayController.getStayById);
router.get('/getuser/:userId', stayController.getStayByUserId);
router.put('/:id', stayController.updateStay);
router.delete('/:id', stayController.deleteStay);

module.exports = router;
