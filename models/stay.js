const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Stay = sequelize.define('Stay', {
  stay_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  room_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  stay_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  stay_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'stay',
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
