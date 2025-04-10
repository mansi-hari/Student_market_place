const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { createError } = require('../utils/errorUtil');


exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return next(createError(401, 'Not authorized to access this route'));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded);
      // Set req.user
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return next(createError(401, 'User not found'));
      }

      next();
    } catch (error) {
      return next(createError(401, 'Not authorized to access this route'));
    }
  } catch (error) {
    console.error('Middleware Error:', error);
    next(error);
  }
};


exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
    // throw new Error("Not authorized as an admin"); // Replaced with JSON response
  }
};