const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Wishlist = require("../models/Wishlist");

// Dashboard Data
router.get("/dashboard", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("name email sellerUniversity profileImage");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const listings = await Product.countDocuments({ seller: userId });
    const orders = await Order.countDocuments({ buyer: userId });
    const wishlist = await Wishlist.findOne({ user: userId });
    const wishlistCount = wishlist ? wishlist.products.length : 0;

    res.json({
      success: true,
      user,
      orders,
      listings,
      wishlist: wishlistCount,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;