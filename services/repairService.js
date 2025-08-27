const { Repair, Admin, Stay, Room, Repairlist } = require('../models');
const notificationRepairService = require('./notificationRepairService');

// ดึงข้อมูลทั้งหมด
exports.getAllRepairs = async () => {
  const repairs = await Repair.findAll({
    include: [
      { model: Admin, attributes: ['admin_name'] },
      { model: Stay, attributes: ['stay_id', 'user_id'], include: [{ model: Room, attributes: ['room_num'] }] },
      { model: Repairlist, attributes: ['repairlist_details', 'repairlist_price'] },
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
    },
  }));
};

// ดึงข้อมูลตาม ID
exports.getRepairById = async (id) => {
  const r = await Repair.findByPk(id, {
    include: [
      { model: Admin, attributes: ['admin_name'] },
      { model: Stay, attributes: ['stay_id', 'user_id'], include: [{ model: Room, attributes: ['room_num'] }] },
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
    repairlist: {
      repairlist_details: r.Repairlist?.repairlist_details || null,
      repairlist_price: r.Repairlist?.repairlist_price || null,
    },
  };
};

// เพิ่มข้อมูล
exports.createRepair = async (data) => {
  const repair = await Repair.create(data);
  const stay = await Stay.findByPk(repair.stay_id, { include: [{ model: Room }] });
  const roomNum = stay?.Room?.room_num || 'ไม่ระบุห้อง';

  await notificationRepairService.createNotification({
    user_id: null,
    admin_id: repair.admin_id,
    title: 'มีรายการซ่อมใหม่',
    message: `มีรายการซ่อมใหม่สำหรับห้อง ${roomNum}`,
    read_status: false,
  });

  return await exports.getRepairById(repair.repair_id);
};

// แก้ไขข้อมูล
exports.updateRepair = async (id, updateData) => {
  const repair = await Repair.findByPk(id);
  if (!repair) return null;

  const prevStatus = repair.repair_status;
  await repair.update(updateData);

  // ถ้าเปลี่ยนสถานะเป็น "ซ่อมแล้ว"
  if (prevStatus === 'รอซ่อม' && updateData.repair_status === 'ซ่อมแล้ว') {
    const stay = await Stay.findByPk(repair.stay_id, { include: [{ model: Room }] });
    console.log('Prev:', prevStatus, 'New:', updateData.repair_status);
    console.log('Stay:', stay?.user_id, stay?.Room?.room_num);

    if (stay?.user_id) {
      await notificationRepairService.createNotification({
        user_id: stay.user_id,
        admin_id: null,
        title: 'งานซ่อมเสร็จแล้ว',
        message: `งานซ่อมสำหรับห้อง ${stay.Room?.room_num || ''} เสร็จเรียบร้อยแล้ว`,
        read_status: false,
      });
    }
  }

  const stay = await Stay.findByPk(repair.stay_id, { include: [{ model: Room }] });
  return {
    repair_id: repair.repair_id,
    repair_date: repair.repair_date,
    repair_status: repair.repair_status,
    room_num: stay?.Room?.room_num || null,
    admin_id: repair.admin_id,
    repairlist_id: repair.repairlist_id,
  };
};

// ลบข้อมูล
exports.deleteRepair = async (id) => {
  const repair = await Repair.findByPk(id);
  if (!repair) return null;
  await repair.destroy();
  return repair;
};
