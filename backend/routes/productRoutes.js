const express = require('express');
const router = express.Router();
const { createProduct } = require('../controllers/Product.controller');
const multer = require('multer'); // File upload handling

// Multer configuration for storing files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Route for creating a product (with photo upload)
router.post('/products', upload.array('photos', 5), createProduct);

module.exports = router;
