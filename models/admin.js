const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  admin_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  admin_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  admin_username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  admin_password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "admin",
  }
}, {
  tableName: 'admins',
  timestamps: false,
});

module.exports = Admin;
