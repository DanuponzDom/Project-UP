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
    allowNull: true,
  },
  stay_id: {
    type: DataTypes.UUID,
    allowNull: true,
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
    defaultValue: 'pending',
  },
}, {
  tableName: 'repairs',
  timestamps: false,
});

module.exports = Repair;
