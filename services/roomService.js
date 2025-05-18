const Room = require('../models/room');
require("dotenv").config();

// CREATE
exports.createRoom = async (data) => {
  if (!data.room_num || !data.room_price) {
    throw new Error("กรุณากรอกข้อมูลให้ครบ");
  }
  return await Room.create(data);
};

// READ ALL
exports.getAllRooms = async () => {
  return await Room.findAll();
};

// READ BY ID
exports.getRoomById = async (id) => {
  const room = await Room.findByPk(id);
  if (!room) throw new Error("ไม่พบห้องนี้");
  return room;
};

// UPDATE
exports.updateRoom = async (id, data) => {
  const room = await Room.findByPk(id);
  if (!room) throw new Error("ไม่พบห้องนี้");
  await room.update(data);
  return room;
};

// DELETE
exports.deleteRoom = async (id) => {
  const room = await Room.findByPk(id);
  if (!room) throw new Error("ไม่พบห้องนี้");
  await room.destroy();
  return { message: "ลบห้องเรียบร้อยแล้ว" };
};
