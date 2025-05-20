const { Stay, User, Room } = require('../models');

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
    user_username: stay.User.user_username,
    room_num: stay.Room.room_num
  }));
};

exports.getStayById = async (id) => {
  const stay = await Stay.findByPk(id, {
    include: [User, Room],
  });
  if (!stay) return null;

  return {
    stay_id: stay.stay_id,
    stay_date: stay.stay_date,
    stay_status: stay.stay_status,
    stay_dateout: stay.stay_dateout,
    user_username: stay.User.user_username,
    room_num: stay.Room.room_num
  };
};

exports.createStay = async (stayData) => {
  const created = await Stay.create(stayData);
  const user = await User.findByPk(stayData.user_id);
  const room = await Room.findByPk(stayData.room_id);

  return {
    stay_id: created.stay_id,
    stay_date: created.stay_date,
    stay_status: created.stay_status,
    stay_dateout: created.stay_dateout,
    user_username: user?.user_username || null,
    room_num: room?.room_num || null
  };
};

exports.updateStay = async (id, updateData) => {
  const stay = await Stay.findByPk(id);
  if (!stay) return null;

  await stay.update(updateData);
  const user = await User.findByPk(updateData.user_id || stay.user_id);
  const room = await Room.findByPk(updateData.room_id || stay.room_id);

  return {
    stay_id: stay.stay_id,
    stay_date: stay.stay_date,
    stay_status: stay.stay_status,
    stay_dateout: stay.stay_dateout,
    user_username: user?.user_username || null,
    room_num: room?.room_num || null
  };
};

exports.deleteStay = async (id) => {
  const stay = await Stay.findByPk(id);
  if (!stay) return null;
  await stay.destroy();
  return stay;
};
