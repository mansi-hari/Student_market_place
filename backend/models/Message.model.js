const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  intentDetected: { type: Boolean, default: false }, // True if "I want to buy" detected
});

module.exports = mongoose.model("Message", messageSchema);