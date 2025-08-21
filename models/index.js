const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Admin = require('./admin');
const User = require('./user');
const Room = require('./room');
const Stay = require('./stay');
const Repair = require('./repair');
const Repairlist = require('./repairlist');
const Expense = require('./expense');
<<<<<<< Updated upstream
const BillType = require('./billtype');
const Payment = require('./payment');
=======
>>>>>>> Stashed changes

Admin.hasMany(Repair, { foreignKey: 'admin_id' });
Repair.belongsTo(Admin, { foreignKey: 'admin_id' });

Stay.hasMany(Repair, { foreignKey: 'stay_id' });
Repair.belongsTo(Stay, { foreignKey: 'stay_id' });

Repairlist.hasMany(Repair, { foreignKey: 'repairlist_id' });
Repair.belongsTo(Repairlist, { foreignKey: 'repairlist_id' });

User.hasMany(Stay, { foreignKey: 'user_id' });
Stay.belongsTo(User, { foreignKey: 'user_id' });

Room.hasMany(Stay, { foreignKey: 'room_id' });
Stay.belongsTo(Room, { foreignKey: 'room_id' });

<<<<<<< Updated upstream
Admin.hasMany(Expense, { foreignKey: 'admin_id' });
Expense.belongsTo(Admin, { foreignKey: 'admin_id' });

Admin.hasMany(Payment, { foreignKey: 'admin_id' });
Payment.belongsTo(Admin, { foreignKey: 'admin_id' });

Stay.hasMany(Payment, { foreignKey: 'stay_id' });
Payment.belongsTo(Stay, { foreignKey: 'stay_id' });

=======
// ความสัมพันธ์: Expense -> Admin
Admin.hasMany(Expense, { foreignKey: 'admin_id' });
Expense.belongsTo(Admin, { foreignKey: 'admin_id' });

// ส่งออก
>>>>>>> Stashed changes
module.exports = {
  sequelize,
  Sequelize,
  Admin,
  User,
  Room,
  Stay,
  Repairlist,
  Repair,
  Expense,
<<<<<<< Updated upstream
  BillType,
  Payment,
};
=======
};
>>>>>>> Stashed changes
