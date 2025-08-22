const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  admin_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  stay_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  water_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  water_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  },
  ele_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  ele_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  },
  other_payment: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  },
  other_payment_detail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payment_total: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  },
  payment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  payment_status: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    defaultValue: '1', // 0 = ค้างชำระ / 1 = กำลังดำเนินการ / 2 = จ่ายละโว้ยยยยยย
  }
}, {
  tableName: 'payments',
  timestamps: false,
});

module.exports = Payment;
