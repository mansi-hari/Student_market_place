// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const Category = require("../models/Category"); // Import your Category model

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch categories from MongoDB
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
