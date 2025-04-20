require("dotenv").config({ path: "./.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

// Get Environment Variables
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/marketplace"; // Default fallback
const PORT = process.env.PORT || 5000;

// Import Routes & Models
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cartRoutes"); // Add this import
const { errorHandler } = require("./middleware/errorMiddleware.js");


const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Debugging: Check if Environment Variables are Loaded
console.log("✅ Checking Environment Variables:");
console.log("MONGODB_URI:", mongoURI ? `Loaded: ${mongoURI}` : "❌ Not Found - Using default");
console.log("PORT:", PORT);

// Connect to MongoDB with better error handling
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Exit if MongoDB fails to connect
  });

app.use("/api", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes); 

// Error Handling Middleware
app.use(errorHandler);

// Setup HTTP Server
const server = http.createServer(app);

// Start Server
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log("🚀 Application is ready to serve requests!");
});

module.exports = app;