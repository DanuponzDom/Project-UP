const billTypeService = require('../services/billTypeService');

// CREATE
exports.create = async (req, res) => {
  try {
    const billType = await billTypeService.createBillType(req.body);
    res.status(201).json(billType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All
exports.getAll = async (req, res) => {
  try {
    const billTypes = await billTypeService.getAllBillTypes();
    res.json(billTypes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get BY ID
exports.getById = async (req, res) => {
  try {
    const billType = await billTypeService.getBillTypeById(req.params.id);
    res.json(billType);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Update
exports.update = async (req, res) => {
  try {
    const billType = await billTypeService.updateBillType(req.params.id, req.body);
    res.json(billType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete
exports.remove = async (req, res) => {
  try {
    await billTypeService.deleteBillType(req.params.id);
    res.json({ message: 'ลบข้อมูลสำเร็จ' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
