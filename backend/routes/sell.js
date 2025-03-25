const express = require("express");
const router = express.Router();
const sellController = require("../controllers/sellController");
const multer = require("multer");

// Setup storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // specify the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique file names
  },
});

const upload = multer({ storage: storage });

// POST request to handle listing an item
router.post("/", upload.array("photos", 5), sellController.listItem);

module.exports = router;
