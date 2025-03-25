const express = require("express");
const Category = require("../models/categoryModel"); // Import Category model

const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch categories from DB
    res.status(200).json(categories); // Send JSON response
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to load categories" });
  }
});

module.exports = router;
