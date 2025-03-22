const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { createError } = require("../utils/errorUtil");
const { sendEmail } = require("../utils/emailUtil");

/**
 * Register a new user
 */
exports.signup = async (req, res, next) => {
  try {
    console.log("Signup request received:", req.body);

    const { name, email, password, university, location } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Ensure location includes pinCode
    if (!location || !location.pinCode) {
      return res.status(400).json({ success: false, message: "PinCode is required" });
    }

    // Hash the password before creating the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword, // ✅ Use the hashed password
      university,
      location,
    });

    await user.save();
    console.log("User saved successfully");

    // Send welcome email
    try {
      const subject = "Welcome to Student Marketplace!";
      const body = `Hello ${name},\n\nThank you for registering with Student Marketplace. We're excited to have you on board.`;
      await sendEmail(email, subject, body);
      console.log("Welcome email sent");
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    // Return user data without password
    const { password: _, ...userData } = user.toObject();

    res.status(201).json({ success: true, token, user: userData });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * Login user
 */
exports.login = async (req, res, next) => {
  try {
    console.log("Incoming login request:", req.body);

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    console.log("Login successful, token generated");

    // Return user data without password
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({ success: true, token, user: userData });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, university, bio, phone, profileImage, location } = req.body;

    if (location && !location.pinCode) {
      return res.status(400).json({ success: false, message: "PinCode is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        university,
        bio,
        phone,
        profileImage,
        location: location ?? user.location, // ✅ Keep old location if not provided
      },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * Change password
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    // ✅ Hash new password before saving
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
