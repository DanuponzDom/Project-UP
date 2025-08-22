const { STRING } = require('sequelize');
const { Repair, Admin, Stay, Room, Repairlist, User } = require('../models');
const notificationRepairService = require('./notificationRepairService');

// ดึงข้อมูลทั้งหมด
exports.getAllRepairs = async () => {
  const repairs = await Repair.findAll({
    include: [
      { model: Admin, attributes: ['admin_name'] },
      { 
        model: Stay, 
        attributes: ['stay_id'],
        include: [
          { model: Room, attributes: ['room_num'] },
          { model: User, attributes: ['user_name'] }
        ]
      },
      { model: Repairlist, attributes: ['repairlist_details', 'repairlist_price'] },
    ],
  });

  return repairs.map(r => ({
    repair_id: r.repair_id,
    repair_date: r.repair_date,
    repair_status: r.repair_status,
    room_num: r.Stay?.Room?.room_num || null,
    admin_name: r.Admin?.admin_name || null,
    user_name: r.Stay?.User?.user_name || null,
    repairlist: {
      repairlist_details: r.Repairlist?.repairlist_details || null,
      repairlist_price: r.Repairlist?.repairlist_price || null,
    }
  }));
};

// ดึง Repair ตาม ID
exports.getRepairById = async (id) => {
  const r = await Repair.findByPk(id, {
    include: [
      { model: Admin, attributes: ['admin_name'] },
      { 
        model: Stay, 
        attributes: ['stay_id'],
        include: [
          { model: Room, attributes: ['room_num'] },
          { model: User, attributes: ['user_name'] }
        ]
      },
      { model: Repairlist, attributes: ['repairlist_details', 'repairlist_price'] },
    ],
  });

  if (!r) return null;

  return {
    repair_id: r.repair_id,
    repair_date: r.repair_date,
    repair_status: r.repair_status,
    room_num: r.Stay?.Room?.room_num || null,
    admin_name: r.Admin?.admin_name || null,
    user_name: r.Stay?.User?.user_name || null,
    repairlist: {
      repairlist_details: r.Repairlist?.repairlist_details || null,
      repairlist_price: r.Repairlist?.repairlist_price || null,
    }
  };
};

// สร้าง Repair + แจ้ง Notification
exports.createRepair = async (data) => {
  console.log("data",data);
  const repair = await Repair.create(data);
  const fullRepair = await exports.getRepairById(repair.repair_id);
  // ส่ง Notification ไป admin ทุกคน
  const admins = await Admin.findAll();
  for (const admin of admins) {
    await notificationRepairService.createNotification({
      admin_id: admin.admin_id,
      title: 'แจ้งซ่อมใหม่',
      message: `ผู้ใช้ ${fullRepair.user_name || 'admin'} แจ้งซ่อมห้อง ${fullRepair.room_num}`
    });
  }

  return fullRepair;
};

// อัปเดต Repair + แจ้ง Notification user
exports.updateRepair = async (id, data) => {
  const repair = await Repair.findByPk(id);
  if (!repair) return null;

  await repair.update(data);
  const fullRepair = await exports.getRepairById(id);

  if (data.repair_status === 'ซ่อมแล้ว' && fullRepair.user_name) {
    await notificationRepairService.createNotification({
      user_id: repair.Stay?.User?.user_id,
      title: 'แจ้งเตือนซ่อมเสร็จ',
      message: `ห้อง ${fullRepair.room_num} ของคุณถูกซ่อมเรียบร้อยแล้ว`
    });
  }

  return fullRepair;
};

// ลบ Repair
exports.deleteRepair = async (id) => {
  const repair = await Repair.findByPk(id);
  if (!repair) return null;
  await repair.destroy();
  return repair;
};
