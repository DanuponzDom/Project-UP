const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Stay = sequelize.define('Stay', {
  stay_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stay_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  stay_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'stay', // ตัวอย่าง: stay, checkout
  },
  stay_dateout: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'stays',
  timestamps: false,
});

module.exports = Stay;
