const Restaurant = require('../models/restaurant');
const Platter = require('../models/platter');
const { getPlatterRecommendations } = require('../utils/recommendations');

/**
 * Get all platters for a restaurant
 * @route GET /api/restaurants/:restaurantId/platters
 */
exports.getPlattersByRestaurant = async (req, res) => {
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
    
    // Get platters for this restaurant
    const platters = await Platter.find({ restaurantId });
    
    res.status(200).json({
      success: true,
      count: platters.length,
      platters
    });
  } catch (error) {
    console.error('Get Platters Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch platters',
      error: error.message
    });
  }
};

/**
 * Get recommended platters based on budget, party size and preferences
 * @route GET /api/restaurants/:restaurantId/recommendations
 */
exports.getRecommendedPlatters = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { budget, partySize, preferences } = req.query;
    
    if (!budget || !partySize) {
      return res.status(400).json({
        success: false,
        message: 'Budget and party size are required'
      });
    }
    
    // Find restaurant to make sure it exists
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    // Get all platters for this restaurant
    const platters = await Platter.find({ restaurantId });
    
    if (platters.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No platters available for this restaurant',
        recommendations: []
      });
    }
    
    // Parse preferences
    const preferencesList = preferences ? preferences.split(',') : [];
    
    // Get recommendations
    const recommendations = getPlatterRecommendations(
      platters,
      parseFloat(budget),
      parseInt(partySize),
      preferencesList
    );
    
    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error('Get Recommendations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations',
      error: error.message
    });
  }
};

/**
 * Get a specific platter by ID
 * @route GET /api/restaurants/:restaurantId/platters/:id
 */
exports.getPlatterById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const platter = await Platter.findById(id);
    
    if (!platter) {
      return res.status(404).json({
        success: false,
        message: 'Platter not found'
      });
    }
    
    res.status(200).json({
      success: true,
      platter
    });
  } catch (error) {
    console.error('Get Platter Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch platter',
      error: error.message
    });
  }
};

/**
 * Create a custom platter
 * @route POST /api/restaurants/:restaurantId/platters/custom
 */
exports.createCustomPlatter = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { 
      originalPlatterId, 
      name, 
      items, 
      servingSize, 
      specialInstructions 
    } = req.body;
    
    if (!originalPlatterId || !name || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Original platter ID, name, and items are required'
      });
    }
    
    // Find restaurant to make sure it exists
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    // Find original platter
    const originalPlatter = await Platter.findById(originalPlatterId);
    
    if (!originalPlatter) {
      return res.status(404).json({
        success: false,
        message: 'Original platter not found'
      });
    }
    
    // Calculate total price based on selected items
    let totalPrice = 0;
    items.forEach(item => {
      const originalItem = originalPlatter.items.find(i => i.id === item.id);
      if (originalItem) {
        totalPrice += originalItem.price * item.quantity;
      }
    });
    
    // Create custom platter
    const customPlatter = new Platter({
      restaurantId,
      name: `Custom: ${name}`,
      basePrice: originalPlatter.basePrice,
      price: totalPrice,
      description: originalPlatter.description,
      items,
      servingSize: servingSize || originalPlatter.servingSize,
      image: originalPlatter.image,
      tags: originalPlatter.tags,
      isCustom: true,
      originalPlatterId,
      specialInstructions,
      createdAt: new Date()
    });
    
    // Save custom platter
    await customPlatter.save();
    
    res.status(201).json({
      success: true,
      message: 'Custom platter created successfully',
      platter: customPlatter
    });
  } catch (error) {
    console.error('Create Custom Platter Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create custom platter',
      error: error.message
    });
  }
};
