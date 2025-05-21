const Repairlist = require('../models/repairlist');

exports.getAllRepairlists = async () => {
  return await Repairlist.findAll();
};

exports.getRepairlistById = async (id) => {
  return await Repairlist.findByPk(id);
};

exports.createRepairlist = async (data) => {
  return await Repairlist.create(data);
};

exports.updateRepairlist = async (id, data) => {
  const repairlist = await Repairlist.findByPk(id);
  if (!repairlist) return null;
  await repairlist.update(data);
  return repairlist;
};

exports.deleteRepairlist = async (id) => {
  const repairlist = await Repairlist.findByPk(id);
  if (!repairlist) return null;
  await repairlist.destroy();
  return repairlist;
};
