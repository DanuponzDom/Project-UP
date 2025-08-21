const paymentService = require('../services/paymentService');

// สร้างการชำระเงินใหม่
exports.createPayment = async (req, res) => {
  try {
    const newPayment = await paymentService.createPayment(req.body);
    res.status(201).json({ message: "สร้างการชำระสำเร็จ", payment: newPayment });
  } catch (err) {
    // ใช้ statusCode จาก error ที่ถูก throw มาจาก service หรือใช้ 500 เป็นค่าเริ่มต้น
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// ดึงข้อมูลการชำระเงินทั้งหมด
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.json(payments);
  } catch (err) {
    // ใช้ statusCode จาก error ที่ถูก throw มาจาก service หรือใช้ 500 เป็นค่าเริ่มต้น
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// ดึงข้อมูลการชำระเงินตาม ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    res.json(payment);
  } catch (err) {
    // ใช้ statusCode จาก error ที่ถูก throw มาจาก service หรือใช้ 404 เป็นค่าเริ่มต้นสำหรับกรณีไม่พบ
    res.status(err.statusCode || 404).json({ message: err.message });
  }
};

// อัปเดตข้อมูลการชำระเงิน
exports.updatePayment = async (req, res) => {
  try {
    const updated = await paymentService.updatePayment(req.params.id, req.body);
    res.json({ message: "อัพเดทสำเร็จ", payment: updated });
  } catch (err) {
    // ใช้ statusCode จาก error ที่ถูก throw มาจาก service หรือใช้ 400 เป็นค่าเริ่มต้นสำหรับข้อมูลไม่ถูกต้อง
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

// ลบข้อมูลการชำระเงิน
exports.deletePayment = async (req, res) => {
  try {
    await paymentService.deletePayment(req.params.id);
    res.json({ message: "ลบข้อมูลสำเร็จ" });
  } catch (err) {
    // ใช้ statusCode จาก error ที่ถูก throw มาจาก service หรือใช้ 400 เป็นค่าเริ่มต้นสำหรับข้อมูลไม่ถูกต้อง
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};