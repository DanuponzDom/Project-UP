const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Expense = sequelize.define('Expense', {
  expense_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  admin_id: {
    type: DataTypes.UUIDV4,
    allowNull: false
  },
  expense_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expense_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  expense_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: 'expenses',
  timestamps: false
});

module.exports = Expense;