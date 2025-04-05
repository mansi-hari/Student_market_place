const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, sellerUniversity, location } = req.body;

    // Validate required fields
    if (!name || !email || !password || !sellerUniversity || !location || !location.pinCode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Validate PIN code
    const validPinCode = "201007";
    if (location.pinCode !== validPinCode) {
      return res.status(400).json({
        success: false,
        message: "This service is only available for Mohan Nagar, Ghaziabad area (PIN: 201007).",
      });
    }

    // Check if user already exists
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
    console.log("Login request received with data:", req.body); // Debugging

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Login failed: User not found.");
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // Compare hashed password with entered password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log("Login failed: Password does not match.");
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // Generate JWT token
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
    console.log("i am consoling the user : ",user)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
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