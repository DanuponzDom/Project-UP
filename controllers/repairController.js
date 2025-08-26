const repairService = require('../services/repairService');

// ดึงข้อมูลทั้งหมด
exports.getAll = async (req, res) => {
  try {
    const repairs = await repairService.getAllRepairs();
    res.json(repairs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึงข้อมูลตาม ID
exports.getById = async (req, res) => {
  try {
    const repair = await repairService.getRepairById(req.params.id);
    if (!repair) return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    res.json(repair);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึงรายการซ่อมของ user ตาม user_id
exports.getByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const repairs = await repairService.getRepairsByUserId(user_id);

    if (!repairs || repairs.length === 0) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลการซ่อมของผู้ใช้คนนี้' });
    }

    res.json(repairs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// เพิ่มข้อมูลใหม่ และแจ้ง Admin
exports.create = async (req, res) => {
  try {
    const repair = await repairService.createRepair(req.body);
    res.status(201).json({
      message: 'สร้างรายการซ่อมสำเร็จ และส่งแจ้งเตือนไปยัง Admin',
      repair,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// แก้ไขข้อมูล และแจ้ง User หากสถานะเปลี่ยนเป็น 'ซ่อมแล้ว'
exports.update = async (req, res) => {
  try {
    const repair = await repairService.updateRepair(req.params.id, req.body);
    if (!repair) return res.status(404).json({ error: 'ไม่พบข้อมูล' });

    let message = 'แก้ไขรายการซ่อมสำเร็จ';
    if (req.body.repair_status === 'ซ่อมแล้ว') {
      message += ' และส่งแจ้งเตือนไปยังผู้ใช้งาน';
    }

    res.json({
      message,
      repair,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ลบข้อมูล
exports.delete = async (req, res) => {
  try {
    const repair = await repairService.deleteRepair(req.params.id);
    if (!repair) return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    res.json({ message: 'ลบรายการซ่อมสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
