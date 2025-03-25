const Product = require('../models/Product.model');
const cloudinary = require('../utils/cloudinary');
const { v4: uuidv4 } = require('uuid'); // To generate unique public_ids

const createProduct = async (req, res) => {
  const { title, category, price, description, condition, location, negotiable, tags, pincode, fullAddress } = req.body;
  const photos = req.files.photos; // Multiple photos uploaded

  try {
    const uploadedPhotos = [];

    for (const photo of photos) {
      const result = await cloudinary.uploader.upload(photo.tempFilePath, {
        folder: "student-marketplace/products", 
      });

      uploadedPhotos.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    const newProduct = new Product({
      title,
      category,
      price,
      description,
      condition,
      location,
      negotiable,
      tags,
      pincode,
      fullAddress,
      photos: uploadedPhotos,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  createProduct,
};
