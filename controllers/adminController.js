const adminService = require("../services/adminService");

exports.register = async (req, res) => {
  try {
    const { admin_name, admin_username, admin_password, admin_tel } = req.body;
    if (!admin_name || !admin_username || !admin_password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const newAdmin = await adminService.registerAdmin({ admin_name, admin_username, admin_password, admin_tel });

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

// GET ALL
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await adminService.getAllAdmins();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET BY ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await adminService.getAdminById(req.params.id);
    res.json(admin);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// UPDATE
exports.updateAdmin = async (req, res) => {
  try {
    const updated = await adminService.updateAdmin(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteAdmin = async (req, res) => {
  try {
    const result = await adminService.deleteAdmin(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
