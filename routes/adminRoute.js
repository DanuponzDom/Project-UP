const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.get('/getall', adminController.getAllAdmins);
router.get('/:id', adminController.getAdminById);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;
