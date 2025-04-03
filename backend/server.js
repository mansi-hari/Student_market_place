// Load Environment Variables First
require("dotenv").config({ path: "./.env" });

// Import Modules
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
const messageRoutes = require("./routes/messageRoutes"); 
const locationRoutes = require("./routes/locationRoutes"); 

const { errorHandler } = require("./middleware/errorMiddleware.js"); 

// Initialize Express App
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

// Define Static Data for States and Cities
const statesAndCities = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Karnataka: ["Bangalore", "Mysore"],
  Delhi: ["New Delhi"],
};

// Get All States and Cities
app.get("/api/states", (req, res) => {
  res.json(statesAndCities);
});


app.use("/api", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/location", locationRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Setup HTTP Server
const server = http.createServer(app);

// Setup WebSocket (Socket.IO)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`✅ A user connected: ${socket.id}`);

  // Join a chat room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`✅ User joined room: ${roomId}`);
  });

  // Handle sending messages
  socket.on("send_message", (data) => {
    if (!data.conversationId || !data.message) {
      console.warn("❌ Invalid message data:", data);
      return;
    }
    io.to(data.conversationId).emit("receive_message", data);
    console.log(`✅ Message sent to room: ${data.conversationId}`);
  });

  // Handle typing indicator
  socket.on("typing", (data) => {
    if (!data.conversationId) {
      console.warn("❌ Invalid typing data:", data);
      return;
    }
    socket.to(data.conversationId).emit("user_typing", data);
    console.log(`✅ Typing event in room: ${data.conversationId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected: ", socket.id);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log("🚀 Application is ready to serve requests!");
});

module.exports = app;