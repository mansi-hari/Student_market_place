const mongoose = require("mongoose");

const sellItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: ["New", "Like New", "Good", "Fair"],
    default: "New",
  },
  tags: {
    type: [String],
    required: false,
  },
  location: {
    type: String,
    required: true,
  },
  negotiable: {
    type: Boolean,
    default: false,
  },
  photos: {
    type: [String], // Array of file paths for photos
    required: true,
  },
});

const SellItem = mongoose.model("SellItem", sellItemSchema);

module.exports = SellItem;
