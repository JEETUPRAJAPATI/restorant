const express = require('express');
const router = express.Router();
const platterController = require('../controllers/platterController');
const authController = require('../controllers/authController');

// All platters for a restaurant
router.get('/restaurants/:restaurantId/platters', platterController.getPlattersByRestaurant);

// Get platter recommendations
router.get('/restaurants/:restaurantId/platters/recommendations', platterController.getRecommendedPlatters);

// Create custom platter
router.post('/restaurants/:restaurantId/platters/custom', platterController.createCustomPlatter);

// Get specific platter by ID
router.get('/platters/:id', platterController.getPlatterById);

module.exports = router;