const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const { createError } = require("../utils/errorUtil");
const { sendEmail } = require("../utils/emailUtil");
const bcrypt = require("bcryptjs");
const Product = require("../models/Product.model");
const Order = require("../models/Order.model");

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, university } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, "User with this email already exists"));
    }

    const user = new User({
      name,
      email,
      password,
      sellerUniversity: university,
    });

    await user.save();

    const subject = "Welcome to Student Marketplace!";
    const body = `Hello ${name},\n\nThank you for registering with Student Marketplace. We're excited to have you on board.`;
    sendEmail(email, subject, body);

    const token = jwt.sign(
      { id: user._id, role: user.role },  
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

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

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(401, "Invalid credentials"));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(createError(401, "Invalid credentials"));
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, // Added role to JWT
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

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

// Get current user profile
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return next(createError(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, university, bio, phone, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, sellerUniversity: university, bio, phone, profileImage },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return next(createError(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return next(createError(401, "Current password is incorrect"));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) return next(createError(404, "User not found"));

    const listings = await Product.countDocuments({ seller: userId });
    const activeListings = await Product.countDocuments({ seller: userId, status: "active" });
    const soldItems = await Product.countDocuments({ seller: userId, status: "completed" });
    const orders = await Order.countDocuments({ buyer: userId });
    const recentOrders = await Order.find({ buyer: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("product");
    const recentListings = await Product.find({ seller: userId })
      .sort({ createdAt: -1 })
      .limit(5);

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