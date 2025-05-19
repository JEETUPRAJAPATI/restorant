
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

router.use(authController.protect);
router.use(authController.restrictTo('admin', 'superadmin'));

router.get('/stats', adminController.getAdminStats);
router.post('/restaurants', adminController.addRestaurant);

module.exports = router;
