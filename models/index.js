const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Room = require('./room');
const Stay = require('./stay');

// กำหนดความสัมพันธ์ระหว่างโมเดล
User.hasMany(Stay, { foreignKey: 'user_id' });
Stay.belongsTo(User, { foreignKey: 'user_id' });

Room.hasMany(Stay, { foreignKey: 'room_id' });
Stay.belongsTo(Room, { foreignKey: 'room_id' });

// ส่งออก
module.exports = {
  sequelize,
  Sequelize,
  User,
  Room,
  Stay,
};
