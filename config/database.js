require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false, // ปิด log ถ้าไม่ต้องการ

    pool: {
      max: 10,         // จำนวน connection สูงสุด
      min: 0,          
      acquire: 30000,  // รอเชื่อมต่อไม่เกิน 30 วิ
      idle: 10000      // ปิด connection ถ้าไม่ได้ใช้เกิน 10 วิ
    },

    dialectOptions: {
      connectTimeout: 10000 // เชื่อมต่อ DB ต้องไม่เกิน 10 วิ
    },

    retry: {
      max: 3 // เชื่อมต่อใหม่ได้สูงสุด 3 ครั้งถ้าล้มเหลว
    }
  }
);

module.exports = sequelize;