const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

exports.registerUser = async ({ user_name, user_username, user_password, user_tel, user_address, user_age }) => {
  if (!user_name || !user_username || !user_password) {
    throw new Error("ข้อมูลไม่ครบ");
  }

  // เช็ค username ว่าซ้ำหรือยัง
  const existingUser = await User.findOne({ where: { user_username: user_username } });
  if (existingUser) {
    throw new Error("Username นี้ถูกใช้แล้ว");
  }

  // เข้ารหัสรหัสผ่าน
  const hashedPassword = await bcrypt.hash(user_password, 10);

  // สร้าง user ใหม่
  const newUser = await User.create({
    user_name: user_name,
    user_username: user_username,
    user_password: hashedPassword,
    user_tel,
    user_address,
    user_age,
    role: "user",  // กำหนด role ตรงนี้เลย
  });

  return newUser;
};

exports.loginUser = async (user_username, user_password) => {
  // หาผู้ใช้ตาม username
  const user = await User.findOne({ where: { user_username: user_username } });
  if (!user) throw new Error("ไม่พบผู้ใช้งาน");

  // ตรวจสอบรหัสผ่าน
  const isMatch = await bcrypt.compare(user_password, user.user_password);
  if (!isMatch) throw new Error("รหัสผ่านไม่ถูกต้อง");

  // สร้าง JWT token
  const token = jwt.sign(
    { id: user.user_id, username: user.user_username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token };
};
