const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Income = sequelize.define('Income', {
  income_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  admin_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  payment_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  income_amount: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false,
  },
  income_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  }
}, {
  tableName: 'income',
  timestamps: false,
});

module.exports = Income;