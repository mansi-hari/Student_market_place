const Wishlist = require('../models/Wishlist.model');
const Product = require('../models/Product.model');

/**
 * Get user's wishlist
 * @route GET /api/wishlist
 * @access Private
 */
exports.getWishlist = async (req, res) => {
  try {
    // Find user's wishlist or create if it doesn't exist
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
      path: 'products',
      select: 'title price photos category condition location createdAt seller sellerName'
    });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [] });
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      count: wishlist.products.length,
      data: {
        _id: wishlist._id,
        products: wishlist.products
      }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching wishlist',
      error: error.message
    });
  }
};

/**
 * Add product to wishlist
 * @route POST /api/wishlist/:productId
 * @access Private
 */
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find user's wishlist or create if it doesn't exist
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [] });
    }

    // Check if product is already in wishlist
    if (wishlist.products.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add product to wishlist
    wishlist.products.push(productId);
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      data: {
        _id: wishlist._id,
        productId
      }
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to wishlist',
      error: error.message
    });
  }
};

/**
 * Remove product from wishlist
 * @route DELETE /api/wishlist/:productId
 * @access Private
 */
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    // Check if product is in wishlist
    if (!wishlist.products.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product not in wishlist'
      });
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      product => product.toString() !== productId
    );
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from wishlist',
      error: error.message
    });
  }
};

/**
 * Clear wishlist
 * @route DELETE /api/wishlist
 * @access Private
 */
exports.clearWishlist = async (req, res) => {
  try {
    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    // Clear products array
    wishlist.products = [];
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared'
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing wishlist',
      error: error.message
    });
  }
};

/**
 * Check if product is in wishlist
 * @route GET /api/wishlist/check/:productId
 * @access Private
 */
exports.checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: {
          isInWishlist: false
        }
      });
    }

    // Check if product is in wishlist
    const isInWishlist = wishlist.products.includes(productId);

    res.status(200).json({
      success: true,
      data: {
        isInWishlist
      }
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking wishlist',
      error: error.message
    });
  }
};