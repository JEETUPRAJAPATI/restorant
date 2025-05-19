
const Restaurant = require('../models/restaurant');
const User = require('../models/user');

exports.getAdminStats = async (req, res) => {
    try {
        const stats = {
            restaurants: await Restaurant.countDocuments(),
            bookings: 0,
            revenue: 0
        };

        // Calculate total bookings and revenue
        const users = await User.find();
        users.forEach(user => {
            stats.bookings += user.bookings.length;
            stats.revenue += user.bookings.reduce((total, booking) => total + booking.totalAmount, 0);
        });

        res.status(200).json({
            success: true,
            ...stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch admin stats'
        });
    }
};

exports.addRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json({
            success: true,
            data: restaurant
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add restaurant'
        });
    }
};
