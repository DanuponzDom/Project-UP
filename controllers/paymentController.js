const paymentService = require('../services/paymentService');

exports.createPayment = async (req, res) => {
  try {
    const newPayment = await paymentService.createPayment(req.body);
    res.status(201).json({ message: "สร้างการชำระสำเร็จ", payment: newPayment });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.json(payments);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    res.json(payment);
  } catch (err) {
    res.status(err.statusCode || 404).json({ message: err.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const updated = await paymentService.updatePayment(req.params.id, req.body);
    res.json({ message: "อัปเดตสำเร็จ", payment: updated });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    await paymentService.deletePayment(req.params.id);
    res.json({ message: "ลบข้อมูลสำเร็จ" });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};
