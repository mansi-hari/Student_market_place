const express = require('express');
const router = express.Router();
const { 
  getNearbyProducts,
  searchByLocation,
  getLocationDetails,
  geocode,
  updateProductLocation,
  getPopularLocations,
  updateUserLocation
} = require('../controllers/Location.controller');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/nearby', getNearbyProducts);
router.get('/search', searchByLocation);
router.get('/details', getLocationDetails);
router.post('/geocode', geocode);
router.get('/popular', getPopularLocations);

// Protected routes
router.put('/products/:id', protect, updateProductLocation);
router.put('/user', protect, updateUserLocation);

module.exports = router;