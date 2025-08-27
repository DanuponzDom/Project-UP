const stayService = require('../services/stayService');

exports.getAllStays = async (req, res) => {
  try {
    const stays = await stayService.getAllStays();
    res.json(stays);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStayById = async (req, res) => {
  try {
    const stay = await stayService.getStayById(req.params.id);
    if (!stay) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(stay);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStayByUserId = async (req, res) => {
  try {
    const stay = await stayService.getStayByUserId(req.params.userId);
    if (!stay) return res.status(404).json({ message: 'ไม่พบ stay ของผู้ใช้' });
    res.json(stay);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createStay = async (req, res) => {
  try {
    const newStay = await stayService.createStay(req.body);
    res.status(201).json(newStay); // ส่งกลับสถานะ 201 Created
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateStay = async (req, res) => {
  try {
    const updated = await stayService.updateStay(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteStay = async (req, res) => {
  try {
    const deleted = await stayService.deleteStay(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json({ message: 'ลบข้อมูลเรียบร้อยแล้ว' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
