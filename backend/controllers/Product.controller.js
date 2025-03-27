const Product = require("../models/Product.model");

exports.createProduct = async (req, res) => {
  try {
    const { title, category, otherCategory, price, description, condition, tags, location, pincode, fullAddress, negotiable } = req.body;

    // Handling photo uploads (if applicable)
    const photos = req.files ? req.files.map(file => file.path) : [];

    const newProduct = new Product({
      title,
      category,
      otherCategory,
      price,
      description,
      condition,
      tags,
      photos,
      location,
      pincode,
      fullAddress,
      negotiable
    });
    console.log(newProduct);
    
    await newProduct.save();
    res.status(201).json({ message: "Item listed successfully!", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, try again later!" });
  }
};
