const express = require('express');
const router = express.Router();
const platterController = require('../controllers/platterController');
const authController = require('../controllers/authController');

/**
 * @route GET /api/restaurants/:restaurantId/platters
 * @desc Get all platters for a restaurant
 * @access Public
 */
router.get('/:restaurantId/platters', platterController.getPlattersByRestaurant);

/**
 * @route GET /api/restaurants/:restaurantId/recommendations
 * @desc Get recommended platters based on budget, party size and preferences
 * @access Public
 */
router.get('/:restaurantId/platters/recommendations', platterController.getRecommendedPlatters);

/**
 * @route POST /api/restaurants/:restaurantId/platters/custom
 * @desc Create a custom platter
 * @access Private (optional)
 */
router.post('/:restaurantId/platters/custom', platterController.createCustomPlatter);

/**
 * @route GET /api/platters/:id
 * @desc Get a specific platter by ID
 * @access Public
 */
router.get('/:restaurantId/platters/:id', platterController.getPlatterById);

module.exports = router;
