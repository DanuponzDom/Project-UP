const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Repairlist = sequelize.define('Repairlist', {
  repairlist_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  repairlist_details: {
    type: DataTypes.STRING,
    allowNull: false
  },
  repairlist_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'repairlist',
  timestamps: false
});

module.exports = Repairlist;
