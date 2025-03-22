const express = require("express")
const router = express.Router()
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getMyProducts,
  getRelatedProducts,
} = require("../controllers/Product.controller")
const { protect } = require("../middleware/authMiddleware")
const Product = require("../models/Product.model");

// POST: Add a new product
router.post("/", async (req, res) => {
  try {
    const { title, category, price, description, location, condition, tags, photos, negotiable } = req.body;

    if (!title || !category || !price || !location) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const newProduct = new Product({
      title,
      category, // Ensure category is stored properly
      price,
      description,
      location,
      condition,
      tags,
      photos,
      negotiable,
      datePosted: new Date(),
      isAvailable: true,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error saving product", error });
  }
});



// Public routes
router.get("/", getProducts)
router.get("/seller/:id", getSellerProducts)
router.get("/:id/related", getRelatedProducts)
router.get("/:id", getProduct)

// Protected routes
router.post("/", protect, createProduct)
router.put("/:id", protect, updateProduct)
router.delete("/:id", protect, deleteProduct)
router.get("/my-products", protect, getMyProducts)

module.exports = router;

