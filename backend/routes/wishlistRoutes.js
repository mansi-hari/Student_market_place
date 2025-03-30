const express = require('express');
const User = require('../models/User.model');
const Product = require('../models/Product.model');

const router = express.Router();

// Add a product to the wishlist
router.post('/', async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
      res.status(200).send('Product added to wishlist');
    } else {
      res.status(400).send('Product is already in wishlist');
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Remove a product from the wishlist
router.delete('/:productId', async (req, res) => {
  const { userId } = req.body;
  const { productId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();
    res.status(200).send('Product removed from wishlist');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Get all products in the user's wishlist
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('wishlist');
    if (!user) return res.status(404).send('User not found');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
