const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const platterController = require('../controllers/platterController');
const addonController = require('../controllers/addonController');
const authController = require('../controllers/authController');

// Auth routes
router.post('/auth/send-otp', authController.sendOTP);
router.post('/auth/verify-otp', authController.verifyOTP);
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authController.protect, authController.getProfile);
router.put('/auth/profile', authController.protect, authController.updateProfile);

// Restaurant routes
router.get('/restaurants', restaurantController.getAllRestaurants);
router.get('/restaurants/favorites', authController.protect, restaurantController.getFavorites);
router.get('/restaurants/:id', restaurantController.getRestaurantById);
router.get('/restaurants/:id/menu', restaurantController.getRestaurantMenu);
router.get('/restaurants/:id/reviews', restaurantController.getRestaurantReviews);
router.get('/restaurants/:id/availability', restaurantController.checkAvailability);
router.post('/restaurants/:id/book', authController.protect, restaurantController.bookEvent);
router.post('/restaurants/:id/favorite', authController.protect, restaurantController.toggleFavorite);

// Platter routes
router.get('/restaurants/:restaurantId/platters', platterController.getPlattersByRestaurant);
router.get('/restaurants/:restaurantId/platters/recommendations', platterController.getRecommendedPlatters);
router.post('/restaurants/:restaurantId/platters/custom', platterController.createCustomPlatter);
router.get('/platters/:id', platterController.getPlatterById);

// Addon routes
router.get('/restaurants/:restaurantId/addons', addonController.getAddonsByRestaurant);
router.get('/restaurants/:restaurantId/addons/categories', addonController.getAddonCategories);
router.get('/restaurants/:restaurantId/addons/:id', addonController.getAddonById);

module.exports = router;