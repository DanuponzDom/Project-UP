const userService = require("../services/userService");

exports.register = async (req, res) => {
  try {
    const { user_name, user_username, user_password } = req.body;
    if (!user_name || !user_username || !user_password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const newUser = await userService.registerUser(req.body);

    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ",
      user: newUser,
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

    const { token } = await userService.loginUser(username, password);

    res.json({ message: "เข้าสู่ระบบสำเร็จ", token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// GET ทั้งหมด
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET รายคน
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// PUT แก้ไข
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};