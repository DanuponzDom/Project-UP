const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BillType = sequelize.define('BillType', {
  billtype_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bill_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  billtype_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'billtypes',
  timestamps: false,
});

module.exports = BillType;
