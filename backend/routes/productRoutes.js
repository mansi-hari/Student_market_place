const express = require("express");
const router = express.Router();
const productController = require("../controllers/Product.controller");
const upload = require("../middleware/uploadMiddleware");

// Create a new product with image upload (up to 5 images)
router.post("/products", upload.array("photos", 5), productController.createProduct);

// Get all products
router.get("/products", productController.getAllProducts);

// Get featured products
router.get("/products/featured", productController.getFeaturedProducts);

// Get products by category
router.get("/products/category/:category", productController.getProductsByCategory);

// Get products grouped by category
router.get("/products-by-category", productController.getProductsGroupedByCategory);

// Get product by ID
router.get("/products/:id", productController.getProductById);

module.exports = router;