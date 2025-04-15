const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    condition: { type: String, default: "New" },
    photos: [{ type: String }],
    location: { type: String, required: true },
    pincode: { type: String, required: true },
    phoneNumber: { type: String },
    email: { type: String },
    negotiable: { type: Boolean, default: false },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isApproved: { type: Boolean, default: false },
    isSold: { type: Boolean, default: false },
    intentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Buyer who showed intent
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Buyer after sale
    collegeLocation: { type: String }, // New field for seller's college
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);