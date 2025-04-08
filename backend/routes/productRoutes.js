// C:\Users\Dell\OneDrive\Desktop\student\backend\routes\productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/Product.controller");
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { createError } = require("../utils/errorUtil");
const Product = require("../models/Product.model");
const User = require("../models/User.model");

// Existing routes
router.post("/products", upload.array("photos", 5), protect, productController.createProduct);
router.get("/products", productController.getAllProducts);
router.get("/products/featured", productController.getFeaturedProducts);
router.get("/products/category/:category", productController.getProductsByCategory);
router.get("/products-by-category", productController.getProductsGroupedByCategory);
router.get("/products/:id", productController.getProductById);

// New endpoint for buyer to show intent
router.post("/products/:id/intent", protect, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(createError(404, "Product not found"));
    if (product.seller.toString() === req.user._id.toString())
      return next(createError(403, "Seller cannot show intent"));
    if (product.intentBy) return next(createError(400, "Intent already registered"));

    product.intentBy = req.user._id;
    await product.save();
    console.log(`Intent registered for product ${req.params.id} by user ${req.user._id}`);
    res.status(200).json({ success: true, message: "Intent registered", data: product });
  } catch (error) {
    console.error("Intent error:", error);
    next(error);
  }
});

// New endpoint for seller to mark as sold
router.put("/products/:id/sold", protect, async (req, res, next) => {
  try {
    console.log(`Received request to mark product ${req.params.id} as sold with buyerEmail: ${req.body.buyerEmail}`);
    const product = await Product.findById(req.params.id);
    if (!product) return next(createError(404, "Product not found"));
    console.log(`Product found: ${product.title}, seller: ${product.seller}, intentBy: ${product.intentBy}`);

    if (product.seller.toString() !== req.user._id.toString())
      return next(createError(403, "Only seller can mark as sold"));
    if (!product.intentBy) return next(createError(400, "No buyer intent registered"));

    const buyerEmail = req.body.buyerEmail;
    const buyer = await User.findOne({ email: buyerEmail });
    if (!buyer) {
      console.log(`Buyer not found with email: ${buyerEmail}`);
      return next(createError(400, "Buyer not found"));
    }
    if (buyer._id.toString() !== product.intentBy.toString()) {
      console.log(`Buyer ID mismatch: ${buyer._id} vs ${product.intentBy}`);
      return next(createError(400, "Invalid buyer email"));
    }

    product.buyer = product.intentBy;
    product.isSold = true;
    product.intentBy = null;
    await product.save();
    console.log(`Product ${req.params.id} marked as sold to ${buyerEmail}`);
    res.status(200).json({ success: true, message: "Item marked as sold", data: product });
  } catch (error) {
    console.error("Sale error:", error);
    next(createError(500, `Internal server error: ${error.message}`));
  }
});

module.exports = router;