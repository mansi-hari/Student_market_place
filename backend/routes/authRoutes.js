const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer"); // For file uploads
const path = require("path");

const router = express.Router();

// Multer configuration for profile image upload
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// ✅ Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, sellerUniversity, location } = req.body;

    if (!name || !email || !password || !sellerUniversity || !location || !location.pinCode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const validPinCode = "201007";
    if (location.pinCode !== validPinCode) {
      return res.status(400).json({
        success: false,
        message: "This service is only available for Mohan Nagar, Ghaziabad area (PIN: 201007).",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    const user = new User({
      name,
      email,
      password,
      sellerUniversity,
      location: {
        formatted: location.formatted || "",
        pinCode: location.pinCode,
      },
    });

    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name, email },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received with data:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Login failed: User not found.");
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log("Login failed: Password does not match.");
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.sellerUniversity,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
});

// ✅ Get Logged-in User (Protected Route)
router.get("/me", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    console.log("i am consoling the user : ", user);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
});

// ✅ Update Logged-in User Profile (Protected Route)
router.put("/me", protect, upload.single("profileImage"), async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, university, bio, phone } = req.body;

    // Validate input
    if (!name && !university && !bio && !phone && !req.file) {
      return res.status(400).json({ success: false, message: "At least one field is required to update." });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (university) updateData.sellerUniversity = university;
    if (bio) updateData.bio = bio;
    if (phone) updateData.phone = phone;
    if (req.file) {
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`; // Full URL
      updateData.profileImage = imageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
});

// ✅ Get All Users (Temporary Debugging Route)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
});

// ✅ Test Route to Check if API Works
router.get("/", (req, res) => {
  res.json({ success: true, message: "Auth routes working!" });
});

// ✅ Dashboard Route
router.get("/dashboard", protect, require("../controllers/userController").getUserDashboard);

module.exports = router;