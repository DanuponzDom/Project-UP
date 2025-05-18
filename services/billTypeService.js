const BillType = require('../models/billType');
require("dotenv").config();

// CREATE
exports.createBillType = async (data) => {
  return await BillType.create(data);
};

// READ ALL
exports.getAllBillTypes = async () => {
  return await BillType.findAll();
};

// READ BY ID
exports.getBillTypeById = async (id) => {
  const billType = await BillType.findByPk(id);
  if (!billType) throw new Error('ไม่พบข้อมูล');
  return billType;
};

// UPDATE
exports.updateBillType = async (id, data) => {
  const billType = await BillType.findByPk(id);
  if (!billType) throw new Error('ไม่พบข้อมูล');
  return await billType.update(data);
};

// DELETE
exports.deleteBillType = async (id) => {
  const billType = await BillType.findByPk(id);
  if (!billType) throw new Error('ไม่พบข้อมูล');
  return await billType.destroy();
};
