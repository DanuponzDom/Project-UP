const { Repair, Admin, Stay, Room, Repairlist } = require('../models');

// ดึงข้อมูลทั้งหมด
exports.getAllRepairs = async () => {
  const repairs = await Repair.findAll({
    include: [
      {
        model: Admin,
        attributes: ['admin_name'],
      },
      {
        model: Stay,
        attributes: ['stay_id'],
        include: [
          {
            model: Room,
            attributes: ['room_num'],
          }
        ]
      },
      {
        model: Repairlist,
        attributes: ['repairlist_details', 'repairlist_price'],
      }
    ],
  });

  return repairs.map(r => ({
    repair_id: r.repair_id,
    repair_date: r.repair_date,
    repair_status: r.repair_status,
    room_num: r.Stay?.Room?.room_num || null,
    admin_name: r.Admin?.admin_name || null,
    repairlist: {
      repairlist_details: r.Repairlist?.repairlist_details || null,
      repairlist_price: r.Repairlist?.repairlist_price || null,
    }
  }));
};

// ดึงข้อมูลตาม ID
exports.getRepairById = async (id) => {
  const r = await Repair.findByPk(id, {
    include: [
      {
        model: Admin,
        attributes: ['admin_name'],
      },
      {
        model: Stay,
        attributes: ['stay_id'],
        include: [
          {
            model: Room,
            attributes: ['room_num'],
          }
        ]
      },
      {
        model: Repairlist,
        attributes: ['repairlist_details', 'repairlist_price'],
      }
    ],
  });

  if (!r) return null;

  return {
    repair_id: r.repair_id,
    repair_date: r.repair_date,
    repair_status: r.repair_status,
    room_num: r.Stay?.Room?.room_num || null,
    admin_name: r.Admin?.admin_name || null,
    repairlist: {
      repairlist_details: r.Repairlist?.repairlist_details || null,
      repairlist_price: r.Repairlist?.repairlist_price || null,
    }
  };
};

// เพิ่มข้อมูล
exports.createRepair = async (data) => {
  const repair = await Repair.create(data);
  return await exports.getRepairById(repair.repair_id);
};

// แก้ไขข้อมูล
exports.updateRepair = async (id, data) => {
  const repair = await Repair.findByPk(id);
  if (!repair) return null;
  await repair.update(data);
  return await exports.getRepairById(id);
};

// ลบข้อมูล
exports.deleteRepair = async (id) => {
  const repair = await Repair.findByPk(id);
  if (!repair) return null;
  await repair.destroy();
  return repair;
};
