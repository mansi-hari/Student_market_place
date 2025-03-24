const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  condition: { type: String, required: true },
  tags: { type: String },
  location: { type: String, required: true },
  negotiable: { type: Boolean, default: false },
  photos: [{ type: String }], // Store paths to the images
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
