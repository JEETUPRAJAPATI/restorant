const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authController = require('../controllers/authController');

/**
 * @route GET /api/restaurants
 * @desc Get all restaurants with filters and location-based sorting
 * @access Public
 */
router.get('/', restaurantController.getAllRestaurants);

/**
 * @route GET /api/restaurants/favorites
 * @desc Get user's favorite restaurants
 * @access Private
 */
router.get('/favorites', authController.protect, restaurantController.getFavorites);

/**
 * @route GET /api/restaurants/:id
 * @desc Get a specific restaurant by ID
 * @access Public
 */
router.get('/:id', restaurantController.getRestaurantById);

/**
 * @route GET /api/restaurants/:id/menu
 * @desc Get restaurant menu
 * @access Public
 */
router.get('/:id/menu', restaurantController.getRestaurantMenu);

/**
 * @route GET /api/restaurants/:id/reviews
 * @desc Get restaurant reviews
 * @access Public
 */
router.get('/:id/reviews', restaurantController.getRestaurantReviews);

/**
 * @route GET /api/restaurants/:id/availability
 * @desc Check restaurant availability for a specific date and party size
 * @access Public
 */
router.get('/:id/availability', restaurantController.checkAvailability);

/**
 * @route POST /api/restaurants/:id/book
 * @desc Book a restaurant for an event
 * @access Private
 */
router.post('/:id/book', authController.protect, restaurantController.bookEvent);

/**
 * @route POST /api/restaurants/:id/favorite
 * @desc Add/remove restaurant from favorites
 * @access Private
 */
router.post('/:id/favorite', authController.protect, restaurantController.toggleFavorite);

/**
 * @route GET /api/restaurants/favorites
 * @desc Get user's favorite restaurants
 * @access Private
 */
router.get('/favorites', authController.protect, restaurantController.getFavorites);

module.exports = router;
