const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Tumhara cloud name
  api_key: process.env.CLOUDINARY_API_KEY,        // API key
  api_secret: process.env.CLOUDINARY_API_SECRET,  // API secret
});

module.exports = cloudinary;
