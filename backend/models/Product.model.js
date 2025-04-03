const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    otherCategory: { type: String },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    condition: { type: String, default: "New" },
    tags: { type: String },
    photos: [{ type: String }],
    location: { type: String, required: true },
    pincode: { type: String, required: true },
    fullAddress: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    negotiable: { type: Boolean, default: false },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sellerUniversity: { type: String, required: true }, // Added for consistency
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);