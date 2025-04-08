const User = require("../models/User.model")
const Product = require("../models/Product.model")

const Message = require("../models/Message.model")
const Conversation = require("../models/Conversation.model")
const Setting = require("../models/Setting.model")
const { createError } = require("../utils/errorUtil")

/**
 * Get dashboard statistics
 * @route GET /api/admin/dashboard
 * @access Private/Admin
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const totalListings = await Product.countDocuments({ seller: userId });
    const activeListings = await Product.countDocuments({ seller: userId, isApproved: true, isSold: false });
    const soldItems = await Product.countDocuments({ seller: userId, isSold: true });

    const recentListings = await Product.find({ seller: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("seller", "name email");

    res.status(200).json({
      success: true,
      data: {
        user: req.user,
        listings: totalListings,
        activeListings,
        soldItems,
        orders: 0, // Placeholder
        recentOrders: [], // Placeholder
        recentListings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// New endpoint for buyer dashboard
exports.getBuyerDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const purchasedItems = await Product.find({ buyer: userId, isSold: true })
      .populate("seller", "name email");
    const activeInterests = await Product.find({ intentBy: userId, isSold: false })
      .populate("seller", "name email");
    res.status(200).json({ success: true, data: { purchasedItems, activeInterests } });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users
 * @route GET /api/admin/users
 * @access Private/Admin
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 })
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

/**
 * Update user
 * @route PUT /api/admin/users/:id
 * @access Private/Admin
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, role, isActive } = req.body

    const user = await User.findById(req.params.id)
    if (!user) {
      return next(createError(404, "User not found"))
    }

    user.name = name || user.name
    user.email = email || user.email
    user.role = role || user.role
    user.isActive = isActive !== undefined ? isActive : user.isActive

    const updatedUser = await user.save()
    res.status(200).json(updatedUser)
  } catch (error) {
    next(error)
  }
}

/**
 * Delete user
 * @route DELETE /api/admin/users/:id
 * @access Private/Admin
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return next(createError(404, "User not found"))
    }

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return next(createError(400, "You cannot delete your own account"))
    }

    await user.remove()
    res.status(200).json({ message: "User deleted successfully" })
  } catch (error) {
    next(error)
  }
}

/**
 * Get all products
 * @route GET /api/admin/products
 * @access Private/Admin
 */
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate("seller", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 })
    res.status(200).json(products)
  } catch (error) {
    next(error)
  }
}

/**
 * Update product
 * @route PUT /api/admin/products/:id
 * @access Private/Admin
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const { title, price, description, category, condition, isAvailable, isFeatured } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) {
      return next(createError(404, "Product not found"))
    }

    product.title = title || product.title
    product.price = price || product.price
    product.description = description || product.description
    product.category = category || product.category
    product.condition = condition || product.condition
    product.isAvailable = isAvailable !== undefined ? isAvailable : product.isAvailable
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured

    const updatedProduct = await product.save()
    res.status(200).json(updatedProduct)
  } catch (error) {
    next(error)
  }
}

/**
 * Delete product
 * @route DELETE /api/admin/products/:id
 * @access Private/Admin
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return next(createError(404, "Product not found"))
    }

    await product.remove()
    res.status(200).json({ message: "Product deleted successfully" })
  } catch (error) {
    next(error)
  }
}

/**
 * Toggle product featured status
 * @route PATCH /api/admin/products/:id/featured
 * @access Private/Admin
 */
exports.toggleProductFeatured = async (req, res, next) => {
  try {
    const { isFeatured } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) {
      return next(createError(404, "Product not found"))
    }

    product.isFeatured = isFeatured
    const updatedProduct = await product.save()
    res.status(200).json(updatedProduct)
  } catch (error) {
    next(error)
  }
}

/**
 * Toggle product availability
 * @route PATCH /api/admin/products/:id/availability
 * @access Private/Admin
 */
exports.toggleProductAvailability = async (req, res, next) => {
  try {
    const { isAvailable } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) {
      return next(createError(404, "Product not found"))
    }

    product.isAvailable = isAvailable
    const updatedProduct = await product.save()
    res.status(200).json(updatedProduct)
  } catch (error) {
    next(error)
  }
}

/**
 * Create category
 * @route POST /api/admin/categories
 * @access Private/Admin
 */
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body

    // Create slug from name
    const slug = name.toLowerCase().replace(/\s+/g, "-")

    // Check if category with same slug exists
    const existingCategory = await Category.findOne({ slug })
    if (existingCategory) {
      return next(createError(400, "Category with this name already exists"))
    }

    const category = new Category({
      name,
      slug,
      description,
    })

    const createdCategory = await category.save()
    res.status(201).json(createdCategory)
  } catch (error) {
    next(error)
  }
}

/**
 * Update category
 * @route PUT /api/admin/categories/:id
 * @access Private/Admin
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, slug, description } = req.body

    const category = await Category.findById(req.params.id)
    if (!category) {
      return next(createError(404, "Category not found"))
    }

    // Check if slug is being changed and if it already exists
    if (slug !== category.slug) {
      const existingCategory = await Category.findOne({ slug })
      if (existingCategory) {
        return next(createError(400, "Category with this slug already exists"))
      }
    }

    category.name = name || category.name
    category.slug = slug || category.slug
    category.description = description !== undefined ? description : category.description

    const updatedCategory = await category.save()
    res.status(200).json(updatedCategory)
  } catch (error) {
    next(error)
  }
}

/**
 * Delete category
 * @route DELETE /api/admin/categories/:id
 * @access Private/Admin
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return next(createError(404, "Category not found"))
    }

    // Check if products are using this category
    const productsCount = await Product.countDocuments({ category: category._id })
    if (productsCount > 0) {
      return next(createError(400, `Cannot delete category. It is being used by ${productsCount} products.`))
    }

    await category.remove()
    res.status(200).json({ message: "Category deleted successfully" })
  } catch (error) {
    next(error)
  }
}

/**
 * Get settings
 * @route GET /api/admin/settings
 * @access Private/Admin
 */
exports.getSettings = async (req, res, next) => {
  try {
    // Get settings or create default if not exists
    let settings = await Setting.findOne()

    if (!settings) {
      settings = await Setting.create({
        siteName: "Student Marketplace",
        siteDescription: "Buy and sell items within your campus community",
        contactEmail: "support@studentmarketplace.com",
        featuredProductsLimit: 8,
        allowUserRegistration: true,
        requireEmailVerification: true,
        maintenanceMode: false,
      })
    }

    res.status(200).json(settings)
  } catch (error) {
    next(error)
  }
}

/**
 * Update settings
 * @route PUT /api/admin/settings
 * @access Private/Admin
 */
exports.updateSettings = async (req, res, next) => {
  try {
    const {
      siteName,
      siteDescription,
      contactEmail,
      featuredProductsLimit,
      allowUserRegistration,
      requireEmailVerification,
      maintenanceMode,
    } = req.body

    // Get settings or create default if not exists
    let settings = await Setting.findOne()

    if (!settings) {
      settings = new Setting({})
    }

    // Update fields
    settings.siteName = siteName || settings.siteName
    settings.siteDescription = siteDescription || settings.siteDescription
    settings.contactEmail = contactEmail || settings.contactEmail
    settings.featuredProductsLimit = featuredProductsLimit || settings.featuredProductsLimit
    settings.allowUserRegistration =
      allowUserRegistration !== undefined ? allowUserRegistration : settings.allowUserRegistration
    settings.requireEmailVerification =
      requireEmailVerification !== undefined ? requireEmailVerification : settings.requireEmailVerification
    settings.maintenanceMode = maintenanceMode !== undefined ? maintenanceMode : settings.maintenanceMode

    const updatedSettings = await settings.save()
    res.status(200).json(updatedSettings)
  } catch (error) {
    next(error)
  }
}

