const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getUserDashboard } = require("../controllers/userController");
const { getBuyerDashboard } = require("../controllers/adminController");
// Dashboard route (already handled in authRoutes.js, keeping here for consistency)
router.get("/dashboard", protect, getUserDashboard);
router.get("/dashboard", protect, getBuyerDashboard);

module.exports = router;