const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const adminRoute = require('./routes/adminRoute');
const userRoute = require('./routes/userRoute');
const roomRoute = require('./routes/roomRoute');
const billTypeRoute = require('./routes/billTypeRoute');
const stayRoute = require('./routes/stayRoute');
const repairlistRoute = require('./routes/repairlistRoute');
const repairRoute = require('./routes/repairRoute');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('เชื่อมต่อเสร็จสิ้น:');
  } catch (error) {
    console.error('ผิดพลาด:', error);
  }
}

testConnection();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // แปลงข้อมูลเป็น JSON

// Routes
app.use('/users', userRoute);
app.use('/admins', adminRoute);
app.use('/rooms', roomRoute);
app.use('/billtype', billTypeRoute);
app.use('/stays', stayRoute);
app.use('/repairlists', repairlistRoute);
app.use('/repairs', repairRoute);

//Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});