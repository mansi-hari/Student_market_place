const express = require("express")
const router = express.Router()
const Product = require("../models/Product")
const { authenticateUser } = require("../middleware/auth")

// Get all products
router.get("/", async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, condition } = req.query

    // Build query
    const query = { status: "Available" }

    if (category && category !== "all") {
      query.category = category
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) query.price.$lte = Number.parseFloat(maxPrice)
    }

    if (condition && condition !== "all") {
      query.condition = condition
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).populate("seller", "name avatar rating")

    res.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ error: "Failed to fetch products" })
  }
})

// Get products near a location
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude are required" })
    }

    const latitude = Number.parseFloat(lat)
    const longitude = Number.parseFloat(lng)
    const maxDistance = Number.parseFloat(radius)

    // Find products near the specified location
    const products = await Product.findNearby({ latitude, longitude }, maxDistance).populate(
      "seller",
      "name avatar rating",
    )

    // Calculate distance for each product
    const productsWithDistance = products.map((product) => {
      const productObj = product.toObject()

      // Calculate distance using the Haversine formula
      const R = 6371 // Earth's radius in km
      const dLat = ((product.location.coordinates.latitude - latitude) * Math.PI) / 180
      const dLon = ((product.location.coordinates.longitude - longitude) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((latitude * Math.PI) / 180) *
          Math.cos((product.location.coordinates.latitude * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c

      productObj.distance = distance
      return productObj
    })

    // Sort by distance
    productsWithDistance.sort((a, b) => a.distance - b.distance)

    res.json(productsWithDistance)
  } catch (error) {
    console.error("Error fetching nearby products:", error)
    res.status(500).json({ error: "Failed to fetch nearby products" })
  }
})

// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "name avatar rating email")

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({ error: "Failed to fetch product" })
  }
})

// Create a new product (protected route)
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { title, price, description, category, condition, images, location } = req.body

    // Validate required fields
    if (!title || !price || !description || !category || !condition || !images || !location) {
      return res.status(400).json({ error: "All fields are required" })
    }

    // Validate location data
    if (
      !location.formattedAddress ||
      !location.coordinates ||
      !location.coordinates.latitude ||
      !location.coordinates.longitude
    ) {
      return res.status(400).json({ error: "Invalid location data" })
    }

    // Create new product
    const newProduct = new Product({
      title,
      price,
      description,
      category,
      condition,
      images,
      location,
      seller: req.user._id,
    })

    await newProduct.save()

    res.status(201).json(newProduct)
  } catch (error) {
    console.error("Error creating product:", error)
    res.status(500).json({ error: "Failed to create product" })
  }
})

// Update a product (protected route)
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Check if the user is the seller
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now(),
      },
      { new: true },
    )

    res.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({ error: "Failed to update product" })
  }
})

// Delete a product (protected route)
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Check if the user is the seller
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    await Product.findByIdAndDelete(req.params.id)

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    res.status(500).json({ error: "Failed to delete product" })
  }
})

module.exports = router

