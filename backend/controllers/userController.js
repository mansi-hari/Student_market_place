// userController.js
const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');

exports.getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    if (!user) return next(createError(404, 'User not found'));

    // Seller Stats
    const listings = await Product.countDocuments({ seller: userId });
    const activeListings = await Product.countDocuments({ seller: userId, isSold: false });
    const soldItems = await Product.countDocuments({ seller: userId, isSold: true });
    const recentListings = await Product.find({ seller: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('seller', 'name email');

    // Buyer Stats
    const orders = await Order.countDocuments({ buyer: userId });
    const recentOrders = await Order.find({ buyer: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('product');
    const purchasedItems = await Product.find({ buyer: userId, isSold: true })
      .populate('seller', 'name email');
    const activeInterests = await Product.find({ intentBy: userId, isSold: false })
      .populate('seller', 'name email');

    res.status(200).json({
      success: true,
      data: {
        user,
        listings,
        activeListings,
        soldItems,
        orders,
        recentOrders,
        recentListings,
        purchasedItems,
        activeInterests,
      },
    });
  } catch (error) {
    next(error);
  }
};