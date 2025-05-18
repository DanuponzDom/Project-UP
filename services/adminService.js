const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
require("dotenv").config();

exports.registerAdmin = async ({ admin_name, admin_username, admin_password }) => {
  if (!admin_name || !admin_username || !admin_password) {
    throw new Error("ข้อมูลไม่ครบ");
  }

  // เช็ค username ว่าซ้ำหรือยัง
  const existingAdmin = await Admin.findOne({ where: { admin_username: admin_username } });
  if (existingAdmin) {
    throw new Error("Username นี้ถูกใช้แล้ว");
  }

  // เข้ารหัสรหัสผ่าน
  const hashedPassword = await bcrypt.hash(admin_password, 10);

  // สร้าง admin ใหม่
  const newAdmin = await Admin.create({
    admin_name: admin_name,
    admin_username: admin_username,
    admin_password: hashedPassword,
    role: "admin",  // กำหนด role ตรงนี้เลย
  });

  return newAdmin;
};

exports.loginAdmin = async (admin_username, admin_password) => {
  // หาผู้ใช้ตาม username
  const admin = await Admin.findOne({ where: { admin_username: admin_username } });
  if (!admin) throw new Error("ไม่พบผู้ใช้งาน");

  // ตรวจสอบรหัสผ่าน
  const isMatch = await bcrypt.compare(admin_password, admin.admin_password);
  if (!isMatch) throw new Error("รหัสผ่านไม่ถูกต้อง");

  // สร้าง JWT token
  const token = jwt.sign(
    { id: admin.admin_id, username: admin.admin_username, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token };
};
