const adminService = require("../services/adminService");

exports.register = async (req, res) => {
  try {
    const { admin_name, admin_username, admin_password } = req.body;
    if (!admin_name || !admin_username || !admin_password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const newAdmin = await adminService.registerAdmin(req.body);

    res.status(201).json({
      message: "สมัครสมาชิกผู้ดูแลระบบสำเร็จ",
      admin: newAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" });
    }

    const { token } = await adminService.loginAdmin(username, password);

    res.json({ message: "เข้าสู่ระบบสำเร็จ", token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
