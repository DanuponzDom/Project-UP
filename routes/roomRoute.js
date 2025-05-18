const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.post('/create', roomController.createRoom);
router.get('/getall', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

module.exports = router;
