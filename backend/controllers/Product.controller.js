// controllers/Product.controller.js
const Product = require("../models/Product.model");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Static list of Mohan Nagar colleges
const colleges = [
  { id: 1, name: "Institute of Technology and Science (ITS), Mohan Nagar" },
  { id: 2, name: "Bhagwati Institute of Technology & Science" },
  { id: 3, name: "IMIRC College" },
  { id: 4, name: "Indirapuram Institute of Higher Studies (IIHS)" },
  { id: 5, name: "Lal Bahadur Shastri Training Institute" },
  { id: 6, name: "Tulsi Academy of Higher Education" },
  { id: 7, name: "Smt. Mohan Kaur College of Law" },
  { id: 8, name: "Avviare Educational Hub Degree College" },
  { id: 9, name: "Modern College of Professional Studies" },
  { id: 10, name: "Krishna Engineering College" },
];

// Create a product
exports.createProduct = async (req, res) => {
  try {
    console.log("Create product request received:", req.body);
    console.log("Files received:", req.files);

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
      
      phoneNumber,
      email,
      negotiable,
    } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!phoneNumber && !email) {
      return res.status(400).json({
        success: false,
        message: "At least one contact method (phone or email) is required",
      });
    }

    const photos = req.files ? req.files.map((file) => file.filename) : [];

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
      
      phoneNumber,
      email,
      negotiable: negotiable === "true" || negotiable === true,
      seller: req.user ? req.user._id : null,
    });

    console.log("Saving product:", newProduct);
    await newProduct.save();
    console.log("Product saved successfully");

    res.status(201).json({
      success: true,
      message: "Item listed successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Server error, try again later!",
    });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    console.log(`Found ${products.length} products`);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error, try again later!" });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("seller", "name profileImage");

    console.log(`Found ${featuredProducts.length} featured products`);
    res.status(200).json(featuredProducts);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ message: "Server error, try again later!" });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`Fetching products for category: ${category}`);

    const products = await Product.find({ category }).sort({ createdAt: -1 });
    console.log(`Found ${products.length} products in category ${category}`);

    res.status(200).json(products);
  } catch (error) {
    console.error(`Error fetching products for category ${req.params.category}:`, error);
    res.status(500).json({ message: "Server error, try again later!" });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(`Fetching product with ID: ${productId}`);

    const product = await Product.findById(productId).populate("seller", "name profileImage");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product found:", product.title);
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error, try again later!" });
  }
};

// Get products grouped by category
exports.getProductsGroupedByCategory = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $group: { _id: "$category", items: { $push: "$$ROOT" } } },
    ]);

    console.log(`Grouped products by category:`, products);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Server error, try again later!" });
  }
};

// New endpoint for getting colleges
exports.getColleges = async (req, res) => {
  try {
    console.log("Fetching colleges list");
    res.status(200).json({
      success: true,
      data: colleges,
    });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).json({
      success: false,
      message: "Server error, try again later!",
    });
  }
};