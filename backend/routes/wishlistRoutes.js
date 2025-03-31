const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const wishlistController = require("../controllers/Wishlist.controller")

// Get user's wishlist
router.get("/", protect, wishlistController.getWishlist)

// Check if product is in wishlist
router.get("/check/:productId", protect, wishlistController.checkWishlist)

// Add product to wishlist
router.post("/:productId", protect, wishlistController.addToWishlist)

// Remove product from wishlist
router.delete("/:productId", protect, wishlistController.removeFromWishlist)

module.exports = router

