const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define('Room', {
  room_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  room_num: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  room_status: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    defaultValue: '0', // 0 = ว่าง, 1 = ไม่ว่าง
  },
  room_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
}, {
  tableName: 'rooms',
  timestamps: false,
});

module.exports = Room;