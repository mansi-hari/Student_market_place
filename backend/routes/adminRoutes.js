const express = require("express")
const router = express.Router()
const { protect, admin } = require("../middleware/authMiddleware")
const {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllProducts,
  updateProduct,
  deleteProduct,
  toggleProductFeatured,
  toggleProductAvailability,
  createCategory,
  updateCategory,
  deleteCategory,
  getSettings,
  updateSettings,
} = require("../controllers/Admin.controller")

// Dashboard routes
router.get("/dashboard", protect, admin, getDashboardStats)

// User management routes
router.get("/users", protect, admin, getAllUsers)
router.put("/users/:id", protect, admin, updateUser)
router.delete("/users/:id", protect, admin, deleteUser)

// Product management routes
router.get("/products", protect, admin, getAllProducts)
router.put("/products/:id", protect, admin, updateProduct)
router.delete("/products/:id", protect, admin, deleteProduct)
router.patch("/products/:id/featured", protect, admin, toggleProductFeatured)
router.patch("/products/:id/availability", protect, admin, toggleProductAvailability)

// Category management routes
router.post("/categories", protect, admin, createCategory)
router.put("/categories/:id", protect, admin, updateCategory)
router.delete("/categories/:id", protect, admin, deleteCategory)

// Settings routes
router.get("/settings", protect, admin, getSettings)
router.put("/settings", protect, admin, updateSettings)

module.exports = router

