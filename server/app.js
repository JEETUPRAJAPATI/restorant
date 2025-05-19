const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Auth Routes
app.post('/api/auth/send-otp', (req, res) => {
  const { phoneNumber } = req.body;
  
  console.log(`[DEMO] Sending OTP to ${phoneNumber}. In demo mode, OTP is always 1234`);
  
  res.status(200).json({
    success: true,
    message: 'OTP sent successfully',
    verificationId: `${phoneNumber}-${Date.now()}`
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;
  
  if (otp !== '1234') {
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP. For demo, use 1234'
    });
  }
  
  console.log(`[DEMO] OTP verification successful for ${phoneNumber}`);
  
  // Demo user
  const user = {
    id: '12345',
    name: 'Demo User',
    phoneNumber,
    email: 'demo@example.com',
    createdAt: new Date()
  };
  
  // Demo token
  const token = 'demo-token-12345';
  
  res.status(200).json({
    success: true,
    message: 'OTP verified successfully',
    token,
    user
  });
});

// Restaurant Routes
app.get('/api/restaurants', (req, res) => {
  // Demo restaurants data
  const restaurants = [
    {
      _id: '1',
      name: 'Spice Garden',
      description: 'Authentic Indian cuisine in a relaxed environment, perfect for celebrations.',
      address: '123 Main St, New York, NY 10001',
      cuisine: 'Indian',
      priceRange: 2,
      rating: 4.5,
      numReviews: 120,
      location: {
        latitude: 40.7128,
        longitude: -74.0060
      },
      images: [
        'https://example.com/spicegarden1.jpg',
        'https://example.com/spicegarden2.jpg',
      ]
    },
    {
      _id: '2',
      name: 'Bella Italia',
      description: 'Family-style Italian restaurant with a warm atmosphere, ideal for family gatherings.',
      address: '456 Park Ave, New York, NY 10002',
      cuisine: 'Italian',
      priceRange: 3,
      rating: 4.7,
      numReviews: 150,
      location: {
        latitude: 40.7142,
        longitude: -74.0050
      },
      images: [
        'https://example.com/bellaitalia1.jpg',
        'https://example.com/bellaitalia2.jpg',
      ]
    },
    {
      _id: '3',
      name: 'Sushi Palace',
      description: 'Modern Japanese restaurant with private dining options for special occasions.',
      address: '789 Broadway, New York, NY 10003',
      cuisine: 'Japanese',
      priceRange: 4,
      rating: 4.8,
      numReviews: 200,
      location: {
        latitude: 40.7135,
        longitude: -74.0040
      },
      images: [
        'https://example.com/sushipalace1.jpg',
        'https://example.com/sushipalace2.jpg',
      ]
    }
  ];
  
  res.status(200).json({
    success: true,
    count: restaurants.length,
    restaurants
  });
});

app.get('/api/restaurants/:id', (req, res) => {
  const { id } = req.params;
  
  // Demo restaurant data
  const restaurant = {
    _id: id,
    name: id === '1' ? 'Spice Garden' : id === '2' ? 'Bella Italia' : 'Sushi Palace',
    description: 'Detailed restaurant description would go here.',
    address: '123 Main St, New York, NY 10001',
    phone: '+1234567891',
    email: 'info@restaurant.com',
    website: 'www.restaurant.com',
    cuisine: id === '1' ? 'Indian' : id === '2' ? 'Italian' : 'Japanese',
    priceRange: parseInt(id) + 1,
    rating: 4.5,
    numReviews: 120,
    location: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    hours: {
      monday: { open: '11:00', close: '22:00', isOpen: true },
      tuesday: { open: '11:00', close: '22:00', isOpen: true },
      wednesday: { open: '11:00', close: '22:00', isOpen: true },
      thursday: { open: '11:00', close: '22:00', isOpen: true },
      friday: { open: '11:00', close: '23:00', isOpen: true },
      saturday: { open: '11:00', close: '23:00', isOpen: true },
      sunday: { open: '12:00', close: '21:00', isOpen: true }
    },
    features: [
      { name: 'Private Room', icon: 'room' },
      { name: 'Outdoor Seating', icon: 'outdoor' },
      { name: 'Live Music', icon: 'music' }
    ],
    eventTypes: [1, 2, 5, 8], // Birthday, Anniversary, Casual Gathering, Holiday
    maxPartySize: 60,
    images: [
      'https://example.com/restaurant1.jpg',
      'https://example.com/restaurant2.jpg',
      'https://example.com/restaurant3.jpg'
    ]
  };
  
  res.status(200).json({
    success: true,
    restaurant
  });
});

// Platters Routes
app.get('/api/restaurants/:restaurantId/platters', (req, res) => {
  const { restaurantId } = req.params;
  
  // Demo platters data
  const platters = [
    {
      _id: '101',
      restaurantId,
      name: 'Party Platter Small',
      description: 'Perfect for small gatherings of 4-6 people.',
      price: 49.99,
      servingSize: 5,
      image: 'https://example.com/platter1.jpg'
    },
    {
      _id: '102',
      restaurantId,
      name: 'Party Platter Medium',
      description: 'Great for medium-sized events of 8-12 people.',
      price: 89.99,
      servingSize: 10,
      image: 'https://example.com/platter2.jpg'
    },
    {
      _id: '103',
      restaurantId,
      name: 'Party Platter Large',
      description: 'Ideal for large gatherings of 15-20 people.',
      price: 149.99,
      servingSize: 18,
      image: 'https://example.com/platter3.jpg'
    },
    {
      _id: '104',
      restaurantId,
      name: 'Vegetarian Platter',
      description: 'Complete vegetarian option for 8-10 people.',
      price: 79.99,
      servingSize: 9,
      image: 'https://example.com/platter4.jpg'
    }
  ];
  
  res.status(200).json({
    success: true,
    count: platters.length,
    platters
  });
});

app.get('/api/restaurants/:restaurantId/platters/recommendations', (req, res) => {
  const { restaurantId } = req.params;
  const { budget, partySize } = req.query;
  
  console.log(`Getting recommendations for restaurant ${restaurantId} with budget ${budget} and party size ${partySize}`);
  
  // Demo recommendations
  const recommendations = [
    {
      _id: '102',
      restaurantId,
      name: 'Party Platter Medium',
      description: 'Great for medium-sized events of 8-12 people.',
      price: 89.99,
      servingSize: 10,
      image: 'https://example.com/platter2.jpg',
      score: 0.85
    },
    {
      _id: '104',
      restaurantId,
      name: 'Vegetarian Platter',
      description: 'Complete vegetarian option for 8-10 people.',
      price: 79.99,
      servingSize: 9,
      image: 'https://example.com/platter4.jpg',
      score: 0.82
    }
  ];
  
  res.status(200).json({
    success: true,
    count: recommendations.length,
    recommendations
  });
});

// Addons Routes
app.get('/api/restaurants/:restaurantId/addons', (req, res) => {
  const { restaurantId } = req.params;
  
  // Demo addons data
  const addons = [
    {
      _id: '201',
      restaurantId,
      name: 'Live Music',
      description: 'Professional musicians performing for your event',
      price: 149.99,
      category: 'Entertainment',
      image: 'https://example.com/addon1.jpg'
    },
    {
      _id: '202',
      restaurantId,
      name: 'Party Decorations',
      description: 'Balloons, banners, and themed decor for your event',
      price: 99.99,
      category: 'Decor',
      image: 'https://example.com/addon2.jpg'
    },
    {
      _id: '203',
      restaurantId,
      name: 'Custom Cake',
      description: 'Personalized celebration cake with your choice of flavor',
      price: 49.99,
      category: 'Food',
      image: 'https://example.com/addon3.jpg'
    },
    {
      _id: '204',
      restaurantId,
      name: 'Photography Package',
      description: 'Professional photographer for 2 hours',
      price: 199.99,
      category: 'Services',
      image: 'https://example.com/addon4.jpg'
    }
  ];
  
  res.status(200).json({
    success: true,
    count: addons.length,
    addons
  });
});

app.get('/api/restaurants/:restaurantId/addons/categories', (req, res) => {
  // Demo categories
  const categories = ['Entertainment', 'Decor', 'Food', 'Services'];
  
  res.status(200).json({
    success: true,
    count: categories.length,
    categories
  });
});

// Root route for API status check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Restaurant Events API is running',
    version: '1.0.0',
  });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  
  res.status(statusCode).json({
    status,
    message: err.message || 'Internal server error',
  });
});

module.exports = app;