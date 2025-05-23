const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');

exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Request received for user ID:', userId, 'Token from header:', req.headers.authorization);
    const cart = await Cart.findOne({ user: userId }).populate('items.product', 'title price photos condition location pincode');
    if (!cart) {
      console.log('No cart found for user:', userId, 'returning empty cart');
      return res.json({ success: true, cart: [] });
    }
    // Filter out items where product is null
    const validItems = cart.items.filter(item => item.product !== null);
    console.log('Cart found for user:', userId, 'Valid Items:', validItems.map(item => ({
      product: item.product ? item.product._id : 'null',
      quantity: item.quantity,
      title: item.product ? item.product.title : 'No title'
    })));
    res.json({ success: true, cart: validItems });
  } catch (error) {
    console.error('Error fetching cart:', error.stack);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      console.log('Creating new cart for user:', userId);
      cart = await Cart.create({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (!existingItem) {
      cart.items.push({ product: productId, quantity: 1 });
      await cart.save();
      console.log('Product added to cart:', { userId, productId, cart: cart.items });
    } else {
      existingItem.quantity += 1;
      await cart.save();
      console.log('Product quantity increased:', { userId, productId, quantity: existingItem.quantity });
    }

    const updatedCart = await Cart.findOne({ user: userId }).populate('items.product', 'title price photos condition location pincode');
    console.log('Verified cart after save:', updatedCart.items.map(item => ({
      product: item.product ? item.product._id : 'null',
      quantity: item.quantity,
      title: item.product ? item.product.title : 'No title'
    })));

    res.json({ success: true, message: 'Product added to cart', cart: updatedCart.items });
  } catch (error) {
    console.error('Error adding to cart:', error.stack);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    console.log('Product removed from cart:', { userId, productId, cart: cart.items });

    const updatedCart = await Cart.findOne({ user: userId }).populate('items.product', 'title price photos condition location pincode');
    console.log('Verified cart after removal:', updatedCart.items.map(item => ({
      product: item.product ? item.product._id : 'null',
      quantity: item.quantity,
      title: item.product ? item.product.title : 'No title'
    })));

    res.json({ success: true, message: 'Product removed from cart', cart: updatedCart.items });
  } catch (error) {
    console.error('Error removing from cart:', error.stack);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};