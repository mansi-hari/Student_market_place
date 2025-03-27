const express = require("express");
const router = express.Router();
const productController = require("../controllers/Product.controller");

router.post("/products", productController.createProduct);

module.exports = router;
