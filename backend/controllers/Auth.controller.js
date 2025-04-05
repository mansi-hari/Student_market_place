const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const { createError } = require('../utils/errorUtil');
const { sendEmail } = require('../utils/emailUtil');
const bcrypt = require("bcryptjs");
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, university } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, 'User with this email already exists'));
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      sellerUniversity: university, // Adjusted to match schema
    });

    await user.save();

    // Send a welcome email
    const subject = 'Welcome to Student Marketplace!';
    const body = `Hello ${name},\n\nThank you for registering with Student Marketplace. We're excited to have you on board.`;
    sendEmail(email, subject, body);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return user data without password
    const { password: _, ...userData } = user.toObject();

    res.status(201).json({
      success: true,
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log(email, password)
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(401, 'Invalid credentials'));
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(createError(401, 'Invalid credentials'));
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return user data without password
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      success: true,
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return next(createError(404, 'User not found'));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * @route PUT /api/auth/me
 * @access Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, university, bio, phone, profileImage } = req.body;

    // Find user and update
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, sellerUniversity: university, bio, phone, profileImage },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return next(createError(404, 'User not found'));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 * @route PUT /api/auth/change-password
 * @access Private
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find user
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(createError(404, 'User not found'));
    }

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return next(createError(401, 'Current password is incorrect'));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user dashboard data
 * @route GET /api/users/dashboard
 * @access Private
 */
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