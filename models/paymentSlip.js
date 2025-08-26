const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentSlip = sequelize.define('PaymentSlip', {
  slip_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  payment_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  stay_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  slip_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uploaded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'payment_slips',
  timestamps: false,
});

module.exports = PaymentSlip;
