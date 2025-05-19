const express = require('express');
const router = express.Router();
const addonController = require('../controllers/addonController');
const authController = require('../controllers/authController');

/**
 * @route GET /api/restaurants/:restaurantId/addons
 * @desc Get all addons for a restaurant
 * @access Public
 */
router.get('/:restaurantId/addons', addonController.getAddonsByRestaurant);

/**
 * @route GET /api/restaurants/:restaurantId/addons/categories
 * @desc Get addon categories for a restaurant
 * @access Public
 */
router.get('/:restaurantId/addons/categories', addonController.getAddonCategories);

/**
 * @route GET /api/restaurants/:restaurantId/addons/:id
 * @desc Get a specific addon by ID
 * @access Public
 */
router.get('/:restaurantId/addons/:id', addonController.getAddonById);

module.exports = router;
