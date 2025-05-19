const express = require('express');
const router = express.Router();
const addonController = require('../controllers/addonController');
const authController = require('../controllers/authController');

// All addons for a restaurant
router.get('/restaurants/:restaurantId/addons', addonController.getAddonsByRestaurant);

// Addon categories
router.get('/restaurants/:restaurantId/addons/categories', addonController.getAddonCategories);

// Get specific addon by ID (using \\d+ to ensure it's a number to prevent conflict with /categories)
router.get('/restaurants/:restaurantId/addons/:id([0-9a-fA-F]{24})', addonController.getAddonById);

module.exports = router;