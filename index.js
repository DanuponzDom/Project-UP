const sequelize = require('./config/database');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('เชื่อมต่อเสร็จสิ้น:');
  } catch (error) {
    console.error('ผิดพลาด:', error);
  }
}

testConnection();