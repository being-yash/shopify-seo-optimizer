const express = require("express");
const router = express.Router();
const {
  getAdminDashboard,
  createVendor
} = require("../controllers/adminController");

router.get("/dashboard", getAdminDashboard);
router.post("/vendors", createVendor);

module.exports = router;
