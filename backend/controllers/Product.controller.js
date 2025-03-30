const Product = require("../models/Product.model")
const path = require("path")
const fs = require("fs")

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Create a product
exports.createProduct = async (req, res) => {
  try {
    console.log("Create product request received:", req.body)
    console.log("Files received:", req.files)

    const {
      title,
      category,
      otherCategory,
      price,
      description,
      condition,
      tags,
      location,
      pincode,
      fullAddress,
      phoneNumber,
      email,
      negotiable,
    } = req.body

    // Validate required fields
    if (!title || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      })
    }

    // Validate contact information
    if (!phoneNumber && !email) {
      return res.status(400).json({
        success: false,
        message: "At least one contact method (phone or email) is required",
      })
    }

    // Handle file uploads - req.files is populated by multer middleware
    const photos = req.files ? req.files.map((file) => file.filename) : []

    // Create new product
    const newProduct = new Product({
      title,
      category: category === "Others" ? otherCategory : category,
      price: Number(price),
      description,
      condition,
      tags,
      photos,
      location,
      pincode,
      fullAddress,
      phoneNumber,
      email,
      negotiable: negotiable === "true" || negotiable === true,
      seller: req.user ? req.user._id : null, // If you have authentication
    })

    console.log("Saving product:", newProduct)
    await newProduct.save()
    console.log("Product saved successfully")

    res.status(201).json({
      success: true,
      message: "Item listed successfully!",
      product: newProduct,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    res.status(500).json({
      success: false,
      message: "Server error, try again later!",
    })
  }
}

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find().sort({ createdAt: -1 })
    console.log(`Found ${products.length} products`)
    res.status(200).json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ message: "Server error, try again later!" })
  }
}

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    // Get the most recent products (limit to 5)
    const featuredProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("seller", "name profileImage")

    console.log(`Found ${featuredProducts.length} featured products`)
    res.status(200).json(featuredProducts)
  } catch (error) {
    console.error("Error fetching featured products:", error)
    res.status(500).json({ message: "Server error, try again later!" })
  }
}

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params
    console.log(`Fetching products for category: ${category}`)

    const products = await Product.find({ category }).sort({ createdAt: -1 })
    console.log(`Found ${products.length} products in category ${category}`)

    res.status(200).json(products)
  } catch (error) {
    console.error(`Error fetching products for category ${req.params.category}:`, error)
    res.status(500).json({ message: "Server error, try again later!" })
  }
}

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id
    console.log(`Fetching product with ID: ${productId}`)

    // Find product by ID and populate seller information
    const product = await Product.findById(productId).populate("seller", "name profileImage")

    // If product not found
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    console.log("Product found:", product.title)
    res.status(200).json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({ message: "Server error, try again later!" })
  }
}

// Get products grouped by category
exports.getProductsGroupedByCategory = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $group: { _id: "$category", items: { $push: "$$ROOT" } } }
    ]);

    console.log(`Grouped products by category:`, products);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Server error, try again later!" });
  }
};

const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let products;

    if (category) {
      products = await Product.find({ category: category });
    } else {
      products = await Product.find();
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
