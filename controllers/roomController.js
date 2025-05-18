const roomService = require('../services/roomService');

// CREATE
exports.createRoom = async (req, res) => {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET BY ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    res.json(room);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// UPDATE
exports.updateRoom = async (req, res) => {
  try {
    const updatedRoom = await roomService.updateRoom(req.params.id, req.body);
    res.json(updatedRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteRoom = async (req, res) => {
  try {
    const result = await roomService.deleteRoom(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
