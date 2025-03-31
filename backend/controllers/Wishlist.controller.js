const Wishlist = require("../models/Wishlist.model")
const Product = require("../models/Product.model")
const { createError } = require("../utils/errorUtil")

/**
 * Get user's wishlist
 * @route GET /api/wishlist
 * @access Private
 */
exports.getWishlist = async (req, res) => {
  try {
    console.log("Getting wishlist for user:", req.user._id)

    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: "products",
      select: "title price photos category condition location createdAt seller",
    })

    if (!wishlist) {
      console.log("No wishlist found, creating new one")
      wishlist = new Wishlist({ user: req.user._id, products: [] })
      await wishlist.save()
    }

    console.log(`Found ${wishlist.products.length} products in wishlist`)

    res.status(200).json({
      success: true,
      count: wishlist.products.length,
      data: {
        _id: wishlist._id,
        products: wishlist.products,
      },
    })
  } catch (error) {
    console.error("Get wishlist error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching wishlist",
      error: error.message,
    })
  }
}

/**
 * Add product to wishlist
 * @route POST /api/wishlist/:productId
 * @access Private
 */
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params
    console.log(`Adding product ${productId} to wishlist for user ${req.user._id}`)

    // Verify product exists
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id })
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] })
    }

    // Check if product is already in wishlist
    if (wishlist.products.includes(productId)) {
      return res.status(200).json({
        success: true,
        message: "Product already in wishlist",
        data: {
          _id: wishlist._id,
          productId,
        },
      })
    }

    // Add product to wishlist
    wishlist.products.push(productId)
    await wishlist.save()
    console.log("Product added to wishlist successfully")

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      data: {
        _id: wishlist._id,
        productId,
      },
    })
  } catch (error) {
    console.error("Add to wishlist error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while adding to wishlist",
      error: error.message,
    })
  }
}

/**
 * Remove product from wishlist
 * @route DELETE /api/wishlist/:productId
 * @access Private
 */
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params
    console.log(`Removing product ${productId} from wishlist for user ${req.user._id}`)

    const wishlist = await Wishlist.findOne({ user: req.user._id })
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      })
    }

    // Check if product is in wishlist
    const productIndex = wishlist.products.indexOf(productId)
    if (productIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Product not in wishlist",
      })
    }

    // Remove product from wishlist
    wishlist.products.splice(productIndex, 1)
    await wishlist.save()
    console.log("Product removed from wishlist successfully")

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    })
  } catch (error) {
    console.error("Remove from wishlist error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while removing from wishlist",
      error: error.message,
    })
  }
}

/**
 * Check if product is in wishlist
 * @route GET /api/wishlist/check/:productId
 * @access Private
 */
exports.checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params

    const wishlist = await Wishlist.findOne({ user: req.user._id })
    const isInWishlist = wishlist && wishlist.products.includes(productId)

    res.status(200).json({
      success: true,
      data: {
        isInWishlist: !!isInWishlist,
      },
    })
  } catch (error) {
    console.error("Check wishlist error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while checking wishlist",
      error: error.message,
    })
  }
}

