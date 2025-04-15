const express = require('express');
const router = express.Router();
const { addToCart, removeFromCart, getCart } = require('../controllers/CartController');
const { protect } = require('../middleware/authMiddleware.js'); // Updated to match filename

router.use(protect); // Use protect middleware to ensure authentication

router.post('/add/:productId', addToCart);
router.delete('/remove/:productId', removeFromCart);
router.get('/', getCart);

module.exports = router;