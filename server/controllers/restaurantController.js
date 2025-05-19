const Restaurant = require('../models/restaurant');
const User = require('../models/user');
const { calculateDistance, getGeoLocation } = require('../utils/location');

/**
 * Get all restaurants with filters and location-based sorting
 * @route GET /api/restaurants
 */
exports.getAllRestaurants = async (req, res) => {
  try {
    const { 
      latitude, 
      longitude, 
      partyType, 
      priceRange, 
      distance: maxDistance,
      search,
      page = 1,
      limit = 20
    } = req.query;
    
    // Build filter object
    const filters = {};
    
    if (partyType) {
      filters.eventTypes = partyType;
    }
    
    if (priceRange) {
      filters.priceRange = { $lte: parseInt(priceRange) };
    }
    
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get restaurants
    let restaurants = await Restaurant.find(filters)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ rating: -1 });
    
    // If location is provided, calculate distance and filter by distance
    if (latitude && longitude) {
      const maxDistanceValue = maxDistance ? parseFloat(maxDistance) : 50;
      
      // Calculate distance for each restaurant
      restaurants = restaurants.map(restaurant => {
        const distanceKm = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          restaurant.location.latitude,
          restaurant.location.longitude
        );
        
        return { 
          ...restaurant.toObject(), 
          distance: parseFloat(distanceKm.toFixed(1))
        };
      });
      
      // Filter by distance
      restaurants = restaurants.filter(restaurant => restaurant.distance <= maxDistanceValue);
      
      // Sort by distance
      restaurants.sort((a, b) => a.distance - b.distance);
    }
    
    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    console.error('Get Restaurants Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurants',
      error: error.message
    });
  }
};

/**
 * Get a specific restaurant by ID
 * @route GET /api/restaurants/:id
 */
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Get Restaurant Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant',
      error: error.message
    });
  }
};

/**
 * Get restaurant menu
 * @route GET /api/restaurants/:id/menu
 */
exports.getRestaurantMenu = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: restaurant.menu || []
    });
  } catch (error) {
    console.error('Get Menu Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant menu',
      error: error.message
    });
  }
};

/**
 * Get restaurant reviews
 * @route GET /api/restaurants/:id/reviews
 */
exports.getRestaurantReviews = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: restaurant.reviews || []
    });
  } catch (error) {
    console.error('Get Reviews Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant reviews',
      error: error.message
    });
  }
};

/**
 * Check restaurant availability for a specific date and party size
 * @route GET /api/restaurants/:id/availability
 */
exports.checkAvailability = async (req, res) => {
  try {
    const { date, partySize } = req.query;
    
    if (!date || !partySize) {
      return res.status(400).json({
        success: false,
        message: 'Date and party size are required'
      });
    }
    
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    // Check availability (simplified logic for demonstration)
    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // For simplicity, let's say restaurant is closed on Mondays (day 1)
    if (dayOfWeek === 1) {
      return res.status(200).json({
        success: true,
        available: false,
        message: 'Restaurant is closed on Mondays'
      });
    }
    
    // For simplicity, let's say restaurant has a max capacity of 50
    if (parseInt(partySize) > 50) {
      return res.status(200).json({
        success: true,
        available: false,
        message: 'Party size exceeds restaurant capacity'
      });
    }
    
    // Check if date is in the past
    if (requestedDate < new Date()) {
      return res.status(200).json({
        success: true,
        available: false,
        message: 'Cannot book for past dates'
      });
    }
    
    // In a real app, you would check existing bookings for the date
    
    // For demonstration, restaurant is available
    res.status(200).json({
      success: true,
      available: true,
      availableTimes: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30']
    });
  } catch (error) {
    console.error('Check Availability Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check availability',
      error: error.message
    });
  }
};

/**
 * Book a restaurant for an event
 * @route POST /api/restaurants/:id/book
 */
exports.bookEvent = async (req, res) => {
  try {
    const { date, time, partySize, eventName, platters, addons } = req.body;
    
    if (!date || !time || !partySize || !eventName) {
      return res.status(400).json({
        success: false,
        message: 'Date, time, party size, and event name are required'
      });
    }
    
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    // Create booking
    const booking = {
      restaurantId: restaurant._id,
      userId: req.user._id,
      date,
      time,
      partySize,
      eventName,
      platters: platters || [],
      addons: addons || [],
      status: 'confirmed',
      totalAmount: req.body.totalAmount || 0,
      createdAt: new Date()
    };
    
    // In a real app, you would save the booking to a bookings collection
    // For demonstration, we'll add it to the user's bookings array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { bookings: booking } },
      { new: true }
    );
    
    res.status(201).json({
      success: true,
      message: 'Event booked successfully',
      data: booking
    });
  } catch (error) {
    console.error('Book Event Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book event',
      error: error.message
    });
  }
};

/**
 * Add/remove restaurant from favorites
 * @route POST /api/restaurants/:id/favorite
 */
exports.toggleFavorite = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    const user = await User.findById(req.user._id);
    
    // Check if restaurant is already in favorites
    const isFavorite = user.favorites.includes(restaurant._id);
    
    if (isFavorite) {
      // Remove from favorites
      await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { favorites: restaurant._id } },
        { new: true }
      );
    } else {
      // Add to favorites
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { favorites: restaurant._id } },
        { new: true }
      );
    }
    
    res.status(200).json({
      success: true,
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      isFavorite: !isFavorite
    });
  } catch (error) {
    console.error('Toggle Favorite Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle favorite',
      error: error.message
    });
  }
};

/**
 * Get user's favorite restaurants
 * @route GET /api/restaurants/favorites
 */
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    
    res.status(200).json({
      success: true,
      count: user.favorites.length,
      data: user.favorites
    });
  } catch (error) {
    console.error('Get Favorites Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get favorite restaurants',
      error: error.message
    });
  }
};
