const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');

exports.getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) return next(createError(404, 'User not found'));

    const listings = await Product.countDocuments({ seller: userId });
    const activeListings = await Product.countDocuments({ seller: userId, status: 'active' });
    const soldItems = await Product.countDocuments({ seller: userId, status: 'completed' });
    const orders = await Order.countDocuments({ buyer: userId });
    const recentOrders = await Order.find({ buyer: userId }).sort({ createdAt: -1 }).limit(5).populate('product');
    const recentListings = await Product.find({ seller: userId }).sort({ createdAt: -1 }).limit(5);

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
      },
    });
  } catch (error) {
    next(error);
  }
};