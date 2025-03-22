const Product = require('../models/Product.model');
const User = require('../models/User.model');
const { createError } = require('../utils/errorUtil');
const { 
  geocodeAddress, 
  reverseGeocode, 
  parseLocationString 
} = require('../utils/locationUtil');

/**
 * Search products by proximity
 * @route GET /api/location/nearby
 * @access Public
 */
exports.getNearbyProducts = async (req, res, next) => {
  try {
    const { 
      lat, 
      lng, 
      distance = 10, // Default 10km radius
      category,
      minPrice,
      maxPrice,
      condition,
      sort = 'distance',
      page = 1,
      limit = 10
    } = req.query;

    // Validate coordinates
    if (!lat || !lng) {
      return next(createError(400, 'Latitude and longitude are required'));
    }

    // Convert to numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const maxDistance = parseFloat(distance) * 1000; // Convert km to meters for MongoDB

    // Build filter
    const filter = {
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude] // MongoDB uses [lng, lat]
          },
          $maxDistance: maxDistance
        }
      },
      isAvailable: true,
      isSold: false
    };

    // Add optional filters
    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    
    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const products = await Product.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .populate('seller', 'name profileImage rating')
      .populate('category', 'name slug');

    // Get total count
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search products by location name
 * @route GET /api/location/search
 * @access Public
 */
exports.searchByLocation = async (req, res, next) => {
  try {
    const { 
      location, 
      distance = 10,
      category,
      minPrice,
      maxPrice,
      condition,
      page = 1,
      limit = 10
    } = req.query;

    if (!location) {
      return next(createError(400, 'Location is required'));
    }

    // Geocode the location
    let coordinates;
    try {
      coordinates = await geocodeAddress(location);
    } catch (error) {
      return next(createError(400, 'Could not geocode location'));
    }

    // Redirect to nearby products endpoint
    req.query.lat = coordinates.lat;
    req.query.lng = coordinates.lng;
    return this.getNearbyProducts(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * Get location details from coordinates
 * @route GET /api/location/details
 * @access Public
 */
exports.getLocationDetails = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return next(createError(400, 'Latitude and longitude are required'));
    }

    const address = await reverseGeocode(parseFloat(lat), parseFloat(lng));

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Geocode an address to coordinates
 * @route POST /api/location/geocode
 * @access Public
 */
exports.geocode = async (req, res, next) => {
  try {
    const { address } = req.body;

    if (!address) {
      return next(createError(400, 'Address is required'));
    }

    const coordinates = await geocodeAddress(address);

    res.status(200).json({
      success: true,
      data: coordinates
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product location
 * @route PUT /api/location/products/:id
 * @access Private
 */
exports.updateProductLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      address, 
      lat, 
      lng,
      locationString
    } = req.body;

    // Find product
    const product = await Product.findById(id);

    if (!product) {
      return next(createError(404, 'Product not found'));
    }

    // Check if user is the seller
    if (product.seller.toString() !== req.user.id) {
      return next(createError(403, 'Not authorized to update this product'));
    }

    // Update location data
    if (lat && lng) {
      // If coordinates provided, update directly
      product.coordinates = {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      };

      // If address not provided, get it from coordinates
      if (!address) {
        try {
          const addressData = await reverseGeocode(parseFloat(lat), parseFloat(lng));
          product.address = addressData;
          product.location = addressData.formatted || locationString || product.location;
        } catch (error) {
          // If reverse geocoding fails, keep existing address
          console.error('Reverse geocoding failed:', error);
        }
      } else {
        product.address = address;
        product.location = locationString || 
          `${address.city}${address.state ? `, ${address.state}` : ''}${address.country ? `, ${address.country}` : ''}`;
      }
    } else if (locationString || address) {
      // If only address provided, geocode it
      const geocodeAddress = locationString || 
        `${address.street || ''}, ${address.city || ''}, ${address.state || ''}, ${address.zipcode || ''}, ${address.country || ''}`;
      
      try {
        const coords = await geocodeAddress(geocodeAddress);
        product.coordinates = {
          type: 'Point',
          coordinates: [coords.lng, coords.lat]
        };
        
        if (address) {
          product.address = address;
        } else {
          // Parse location string
          const parsedLocation = parseLocationString(locationString);
          product.address = {
            city: parsedLocation.city,
            state: parsedLocation.state,
            country: parsedLocation.country
          };
        }
        
        product.location = locationString || product.location;
      } catch (error) {
        return next(createError(400, 'Could not geocode address'));
      }
    } else {
      return next(createError(400, 'Either coordinates or address is required'));
    }

    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get popular locations
 * @route GET /api/location/popular
 * @access Public
 */
exports.getPopularLocations = async (req, res, next) => {
  try {
    // Aggregate products by location and count
    const popularLocations = await Product.aggregate([
      {
        $match: {
          isAvailable: true,
          isSold: false
        }
      },
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.status(200).json({
      success: true,
      data: popularLocations.map(location => ({
        location: location._id,
        count: location.count
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user location
 * @route PUT /api/location/user
 * @access Private
 */
exports.updateUserLocation = async (req, res, next) => {
  try {
    const { 
      lat, 
      lng, 
      address,
      locationString
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(createError(404, 'User not found'));
    }

    // Update user location
    if (!user.location) {
      user.location = {};
    }

    if (lat && lng) {
      user.location.coordinates = {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      };

      if (!address && !user.location.address) {
        try {
          const addressData = await reverseGeocode(parseFloat(lat), parseFloat(lng));
          user.location.address = addressData;
          user.location.formatted = addressData.formatted || locationString || '';
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
        }
      } else if (address) {
        user.location.address = address;
        user.location.formatted = locationString || 
          `${address.city}${address.state ? `, ${address.state}` : ''}${address.country ? `, ${address.country}` : ''}`;
      }
    } else if (locationString || address) {
      const geocodeAddress = locationString || 
        `${address.street || ''}, ${address.city || ''}, ${address.state || ''}, ${address.zipcode || ''}, ${address.country || ''}`;
      
      try {
        const coords = await geocodeAddress(geocodeAddress);
        user.location.coordinates = {
          type: 'Point',
          coordinates: [coords.lng, coords.lat]
        };
        
        if (address) {
          user.location.address = address;
        } else {
          const parsedLocation = parseLocationString(locationString);
          user.location.address = {
            city: parsedLocation.city,
            state: parsedLocation.state,
            country: parsedLocation.country
          };
        }
        
        user.location.formatted = locationString || '';
      } catch (error) {
        return next(createError(400, 'Could not geocode address'));
      }
    } else {
      return next(createError(400, 'Either coordinates or address is required'));
    }

    await user.save();

    // Don't return password
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      success: true,
      data: userObj
    });
  } catch (error) {
    next(error);
  }
};