const { Repair, Admin, Stay, Room, Repairlist } = require('../models');
const createNotification = require('./notificationRepairService');

// ดึงข้อมูลทั้งหมด
exports.getAllRepairs = async () => {
  const repairs = await Repair.findAll({
    include: [
      { model: Admin, attributes: ['admin_name'] },
      { model: Stay, attributes: ['stay_id'], include: [{ model: Room, attributes: ['room_num'] }] },
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
      { model: Stay, attributes: ['stay_id'], include: [{ model: Room, attributes: ['room_num'] }] },
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

// ดึงข้อมูลการซ่อมตาม user_id
exports.getRepairsByUserId = async (userId) => {
  const repairs = await Repair.findAll({
    include: [
      { model: Admin, attributes: ['admin_name'] },
      { 
        model: Stay,
        attributes: ['stay_id', 'user_id'],
        include: [{ model: Room, attributes: ['room_num'] }],
        where: { user_id: userId } // กรองเฉพาะ user นี้
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
    repairlist: {
      repairlist_details: r.Repairlist?.repairlist_details || null,
      repairlist_price: r.Repairlist?.repairlist_price || null,
    },
  }));
};


// เพิ่มข้อมูล
exports.createRepair = async (data) => {
  const repair = await Repair.create(data);

  // ดึงข้อมูล stay + room
  const stay = await Stay.findByPk(repair.stay_id, { include: Room });
  const roomNum = stay?.Room?.room_num || 'ไม่ระบุห้อง';

  // สร้าง Notification ไปให้ admin
  await createNotification.createNotification({
    user_id: null,
    admin_id: repair.admin_id, // ส่งไปยัง admin
    title: 'มีรายการซ่อมใหม่',
    message: `มีรายการซ่อมใหม่สำหรับห้อง ${roomNum}`,
    read_status: false
  });

  // ส่งกลับข้อมูล repair
  return await exports.getRepairById(repair.repair_id);
};

// แก้ไขข้อมูล
exports.updateRepair = async (id, updateData) => {
  const repair = await Repair.findByPk(id);
  if (!repair) return null;

  // ตรวจสอบว่าเปลี่ยนสถานะเป็น "ซ่อมแล้ว"
  const prevStatus = repair.repair_status;
  await repair.update(updateData);

  if (prevStatus === 'รอซ่อม' && updateData.repair_status === 'ซ่อมแล้ว') {
    // ดึงข้อมูล stay + room
    const stay = await Stay.findByPk(repair.stay_id, { include: Room });
    const roomNum = stay?.Room?.room_num || 'ไม่ระบุห้อง';

    // สร้าง Notification ไปให้ผู้ใช้งาน
    await createNotification.createNotification({
      user_id: stay.user_id,
      admin_id: null,
      title: 'งานซ่อมเสร็จแล้ว',
      message: `งานซ่อมสำหรับห้อง ${roomNum} เสร็จเรียบร้อยแล้ว`,
      read_status: false
    });
  }

  // ส่งข้อมูลกลับเหมือนเดิม
  const stay = await Stay.findByPk(repair.stay_id, { include: Room });
  const userRoomNum = stay?.Room?.room_num || null;
  const room = await Room.findByPk(updateData.room_id || repair.room_id);

  return {
    repair_id: repair.repair_id,
    repair_date: repair.repair_date,
    repair_status: repair.repair_status,
    room_num: room?.room_num || userRoomNum,
    admin_id: repair.admin_id,
    repairlist_id: repair.repairlist_id
  };
};

// ลบข้อมูล
exports.deleteRepair = async (id) => {
  const repair = await Repair.findByPk(id);
  if (!repair) return null;

  await repair.destroy();
  return repair;
};