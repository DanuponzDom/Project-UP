const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Repair = sequelize.define('Repair', {
  repair_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  admin_id: {
    type: DataTypes.UUID,
    allowNull: true, // admin อาจจะ null ถ้า user แจ้ง
  },
  stay_id: {
    type: DataTypes.UUID,
    allowNull: true, // user อาจจะ null ถ้า admin แจ้ง
  },
  repairlist_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  repair_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  repair_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'รอซ่อม',
  },
}, {
  tableName: 'repairs',
  timestamps: false,
});

module.exports = Repair;
