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
    const product = await Product.findById(req.params.id);
    if (!product) return next(createError(404, "Product not found"));
    if (product.seller.toString() !== req.user._id.toString())
      return next(createError(403, "Only seller can mark as sold"));
    if (!product.intentBy) return next(createError(400, "No buyer intent registered"));

    const buyer = await User.findById(product.intentBy);
    if (!buyer) return next(createError(400, "Buyer not found"));

    product.buyer = product.intentBy;
    product.isSold = true;
    product.intentBy = null;
    await product.save();
    console.log(`Product ${req.params.id} marked as sold to ${buyer.email}`);
    res.status(200).json({ success: true, message: "Item marked as sold", data: product });
  } catch (error) {
    console.error("Sale error:", error);
    next(createError(500, `Internal server error: ${error.message}`));
  }
});

router.post("/products/:id/approve-sale", protect, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(createError(404, "Product not found"));
    if (req.user.role !== 'admin' && product.seller.toString() !== req.user._id.toString())
      return next(createError(403, "Only admin or seller can approve sale"));
    if (!product.intentBy) return next(createError(400, "No buyer intent registered"));

    product.buyer = product.intentBy;
    product.isSold = true;
    product.intentBy = null;
    await product.save();
    res.status(200).json({ success: true, message: "Sale approved", data: product });
  } catch (error) {
    console.error("Approve sale error:", error);
    next(createError(500, `Internal server error: ${error.message}`));
  }
});
module.exports = router;