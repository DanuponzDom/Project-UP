const repairlistService = require('../services/repairlistService');

exports.getAll = async (req, res) => {
  try {
    const data = await repairlistService.getAllRepairlists();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await repairlistService.getRepairlistById(req.params.id);
    if (!data) return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await repairlistService.createRepairlist(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await repairlistService.updateRepairlist(req.params.id, req.body);
    if (!data) return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const data = await repairlistService.deleteRepairlist(req.params.id);
    if (!data) return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    res.json({ message: 'ลบข้อมูลเรียบร้อยแล้ว' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
