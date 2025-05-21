const repairService = require('../services/repairService');

exports.getAll = async (req, res) => {
  try {
    const repairs = await repairService.getAllRepairs();
    res.json(repairs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const repair = await repairService.getRepairById(req.params.id);
    if (!repair) return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    res.json(repair);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const repair = await repairService.createRepair(req.body);
    res.status(201).json(repair);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const repair = await repairService.updateRepair(req.params.id, req.body);
    if (!repair) return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    res.json(repair);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const repair = await repairService.deleteRepair(req.params.id);
    if (!repair) return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    res.json({ message: 'ลบข้อมูลสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
