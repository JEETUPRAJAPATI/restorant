const Restaurant = require('../models/restaurant');
const Addon = require('../models/addon');

/**
 * Get all addons for a restaurant
 * @route GET /api/restaurants/:restaurantId/addons
 */
exports.getAddonsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { platterId } = req.query;
    
    // Find restaurant to make sure it exists
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    // Build query for addons
    const query = { restaurantId };
    
    // If platterId is provided, filter addons that are compatible with the platter
    if (platterId) {
      query.compatiblePlatters = { $in: [platterId] };
    }
    
    // Get addons for this restaurant
    const addons = await Addon.find(query);
    
    res.status(200).json({
      success: true,
      count: addons.length,
      addons
    });
  } catch (error) {
    console.error('Get Addons Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addons',
      error: error.message
    });
  }
};

/**
 * Get a specific addon by ID
 * @route GET /api/restaurants/:restaurantId/addons/:id
 */
exports.getAddonById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const addon = await Addon.findById(id);
    
    if (!addon) {
      return res.status(404).json({
        success: false,
        message: 'Addon not found'
      });
    }
    
    res.status(200).json({
      success: true,
      addon
    });
  } catch (error) {
    console.error('Get Addon Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addon',
      error: error.message
    });
  }
};

/**
 * Get addon categories for a restaurant
 * @route GET /api/restaurants/:restaurantId/addons/categories
 */
exports.getAddonCategories = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    // Find restaurant to make sure it exists
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    // Get all addons for this restaurant
    const addons = await Addon.find({ restaurantId });
    
    // Extract unique categories
    const categories = [...new Set(addons.map(addon => addon.category))];
    
    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    console.error('Get Addon Categories Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addon categories',
      error: error.message
    });
  }
};
