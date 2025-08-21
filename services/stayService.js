const { Stay, User, Room, Repair, Payment } = require('../models');

// GET ALL STAYS
exports.getAllStays = async () => {
  const stays = await Stay.findAll({
    include: [User, Room],
    order: [['stay_id', 'ASC']],
  });

  return stays.map(stay => ({
    stay_id: stay.stay_id,
    stay_date: stay.stay_date,
    stay_status: stay.stay_status,
    stay_dateout: stay.stay_dateout,
    user_name: stay.User.user_name,
    room_num: stay.Room.room_num
  }));
};

// GET STAY BY ID
exports.getStayById = async (id) => {
  const stay = await Stay.findByPk(id, { include: [User, Room] });
  if (!stay) return null;

  return {
    stay_id: stay.stay_id,
    stay_date: stay.stay_date,
    stay_status: stay.stay_status,
    stay_dateout: stay.stay_dateout,
    user_name: stay.User.user_name,
    room_num: stay.Room.room_num
  };
};

// CREATE STAY
exports.createStay = async (stayData) => {
  // สร้าง Stay ใหม่
  const created = await Stay.create(stayData);

  // อัปเดตสถานะห้องเป็นไม่ว่าง
  await Room.update(
    { room_status: '1' }, // 1 = ไม่ว่าง
    { where: { room_id: stayData.room_id } }
  );

  const user = await User.findByPk(stayData.user_id);
  const room = await Room.findByPk(stayData.room_id);

  return {
    stay_id: created.stay_id,
    stay_date: created.stay_date,
    stay_status: created.stay_status,
    stay_dateout: created.stay_dateout,
    user_name: user?.user_name || null,
    room_num: room?.room_num || null
  };
};

// UPDATE STAY
exports.updateStay = async (id, updateData) => {
  const stay = await Stay.findByPk(id);
  if (!stay) return null;

  // ถ้าเปลี่ยนสถานะเป็น 2 (ย้ายออกแล้ว) → ปล่อยห้องว่าง
  if (updateData.stay_status === 2) {
    await Room.update(
      { room_status: '0' }, // 0 = ว่าง
      { where: { room_id: stay.room_id } }
    );
    if (!updateData.stay_dateout) {
      updateData.stay_dateout = new Date();
    }
  }

  await stay.update(updateData);

  // ถ้าเปลี่ยนห้องใหม่ หรือ stay_status = 0 (เข้าพัก) → ห้องใหม่ไม่ว่าง
  if (updateData.room_id && updateData.room_id !== stay.room_id) {
    await Room.update(
      { room_status: '1' },
      { where: { room_id: updateData.room_id } }
    );
    // ห้องเดิมที่ถูกย้ายออก → ว่าง
    await Room.update(
      { room_status: '0' },
      { where: { room_id: stay.room_id } }
    );
  } else if (updateData.stay_status === 0) {
    await Room.update(
      { room_status: '1' },
      { where: { room_id: stay.room_id } }
    );
  }

  const user = await User.findByPk(updateData.user_id || stay.user_id);
  const room = await Room.findByPk(updateData.room_id || stay.room_id);

  return {
    stay_id: stay.stay_id,
    stay_date: stay.stay_date,
    stay_status: stay.stay_status,
    stay_dateout: stay.stay_dateout,
    user_name: user?.user_name || null,
    room_num: room?.room_num || null
  };
};

// DELETE Stay
exports.deleteStay = async (id) => {
  const stay = await Stay.findByPk(id);
  if (!stay) return null;

  // ตรวจสอบว่ามีการใช้งานใน Repair หรือ Payment หรือไม่
  const usedInRepair = await Repair.count({ where: { stay_id: id } });
  const usedInPayment = await Payment.count({ where: { stay_id: id } });

  if (usedInRepair > 0 || usedInPayment > 0) {
    throw new Error("ไม่สามารถลบ Stay ได้ เนื่องจากถูกใช้งานใน Repair หรือ Payment");
  }

  // ปล่อยห้องว่างก่อนลบ
  await Room.update(
    { room_status: '0' },
    { where: { room_id: stay.room_id } }
  );

  await stay.destroy();
  return stay;
};
