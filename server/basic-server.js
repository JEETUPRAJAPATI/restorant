const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Demo data
const restaurants = [
  {
    id: '1',
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
    images: ['https://example.com/spicegarden1.jpg', 'https://example.com/spicegarden2.jpg']
  },
  {
    id: '2',
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
    images: ['https://example.com/bellaitalia1.jpg', 'https://example.com/bellaitalia2.jpg']
  },
  {
    id: '3',
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
    images: ['https://example.com/sushipalace1.jpg', 'https://example.com/sushipalace2.jpg']
  }
];

// Demo platters data organized by restaurant id
const platters = {
  '1': [
    {
      id: '101',
      name: 'Indian Party Platter Small',
      description: 'Perfect for small gatherings of 4-6 people featuring Indian specialties.',
      price: 49.99,
      servingSize: 5,
      image: 'https://example.com/platter1.jpg',
      tags: ['party', 'popular']
    },
    {
      id: '102',
      name: 'Indian Party Platter Medium',
      description: 'Great for medium-sized events of 8-12 people with a variety of Indian dishes.',
      price: 89.99,
      servingSize: 10,
      image: 'https://example.com/platter2.jpg',
      tags: ['party', 'popular', 'value']
    },
    {
      id: '103',
      name: 'Indian Party Platter Large',
      description: 'Ideal for large gatherings of 15-20 people with comprehensive menu options.',
      price: 149.99,
      servingSize: 18,
      image: 'https://example.com/platter3.jpg',
      tags: ['party', 'large', 'catering']
    },
    {
      id: '104',
      name: 'Indian Vegetarian Platter',
      description: 'Complete vegetarian option for 8-10 people featuring vegetarian specialties.',
      price: 79.99,
      servingSize: 9,
      image: 'https://example.com/platter4.jpg',
      tags: ['vegetarian', 'healthy', 'party']
    }
  ],
  '2': [
    {
      id: '201',
      name: 'Italian Party Platter Small',
      description: 'Perfect for small gatherings of 4-6 people featuring Italian specialties.',
      price: 59.99,
      servingSize: 5,
      image: 'https://example.com/platter5.jpg',
      tags: ['party', 'popular']
    },
    {
      id: '202',
      name: 'Italian Party Platter Medium',
      description: 'Great for medium-sized events of 8-12 people with a variety of Italian dishes.',
      price: 99.99,
      servingSize: 10,
      image: 'https://example.com/platter6.jpg',
      tags: ['party', 'popular', 'value']
    }
  ],
  '3': [
    {
      id: '301',
      name: 'Sushi Party Platter Small',
      description: 'Perfect for small gatherings of 4-6 people featuring sushi specialties.',
      price: 69.99,
      servingSize: 5,
      image: 'https://example.com/platter7.jpg',
      tags: ['party', 'popular']
    },
    {
      id: '302',
      name: 'Sushi Party Platter Large',
      description: 'Ideal for large gatherings of 15-20 people with comprehensive sushi options.',
      price: 169.99,
      servingSize: 18,
      image: 'https://example.com/platter8.jpg',
      tags: ['party', 'large', 'catering']
    }
  ]
};

// Demo addons data organized by restaurant id
const addons = {
  '1': [
    {
      id: '401',
      name: 'Live Music',
      description: 'Professional musicians performing for your event',
      price: 149.99,
      category: 'Entertainment',
      image: 'https://example.com/addon1.jpg'
    },
    {
      id: '402',
      name: 'Party Decorations',
      description: 'Balloons, banners, and themed decor for your event',
      price: 99.99,
      category: 'Decor',
      image: 'https://example.com/addon2.jpg'
    }
  ],
  '2': [
    {
      id: '403',
      name: 'Custom Cake',
      description: 'Personalized celebration cake with your choice of flavor',
      price: 49.99,
      category: 'Food',
      image: 'https://example.com/addon3.jpg'
    },
    {
      id: '404',
      name: 'Photography Package',
      description: 'Professional photographer for 2 hours',
      price: 199.99,
      category: 'Services',
      image: 'https://example.com/addon4.jpg'
    }
  ],
  '3': [
    {
      id: '405',
      name: 'Karaoke Setup',
      description: 'Complete karaoke system with thousands of songs',
      price: 129.99,
      category: 'Entertainment',
      image: 'https://example.com/addon5.jpg'
    },
    {
      id: '406',
      name: 'Sake Tasting',
      description: 'Premium sake selection with expert guide',
      price: 89.99,
      category: 'Food',
      image: 'https://example.com/addon6.jpg'
    }
  ]
};

// Basic Routes

// Root route
app.get('/', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Restaurant Events API is running', 
    version: '1.0.0'
  });
});

// Get all restaurants
app.get('/api/restaurants', (req, res) => {
  const { latitude, longitude, cuisine, priceRange, rating } = req.query;

  let filteredRestaurants = [...restaurants];

  // Filter by cuisine if provided
  if (cuisine) {
    filteredRestaurants = filteredRestaurants.filter(r => 
      r.cuisine.toLowerCase() === cuisine.toLowerCase()
    );
  }

  // Filter by price range if provided
  if (priceRange) {
    const price = parseInt(priceRange);
    if (!isNaN(price)) {
      filteredRestaurants = filteredRestaurants.filter(r => r.priceRange <= price);
    }
  }

  // Filter by rating if provided
  if (rating) {
    const minRating = parseFloat(rating);
    if (!isNaN(minRating)) {
      filteredRestaurants = filteredRestaurants.filter(r => r.rating >= minRating);
    }
  }

  // Sort by distance if latitude and longitude provided
  if (latitude && longitude) {
    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);

    if (!isNaN(userLat) && !isNaN(userLng)) {
      // Calculate distance for each restaurant
      filteredRestaurants.forEach(r => {
        const restaurantLat = r.location.latitude;
        const restaurantLng = r.location.longitude;

        // Simple distance calculation (not actual distance, just for sorting)
        const distance = Math.sqrt(
          Math.pow(userLat - restaurantLat, 2) + 
          Math.pow(userLng - restaurantLng, 2)
        );

        r.distance = distance;
      });

      // Sort by distance
      filteredRestaurants.sort((a, b) => a.distance - b.distance);
    }
  }

  res.json({ 
    success: true, 
    count: filteredRestaurants.length, 
    restaurants: filteredRestaurants 
  });
});

// Get restaurant by id
app.get('/api/restaurants/:id', (req, res) => {
  const id = req.params.id;
  const restaurant = restaurants.find(r => r.id === id);

  if (!restaurant) {
    return res.status(404).json({ 
      success: false, 
      message: 'Restaurant not found' 
    });
  }

  res.json({ 
    success: true, 
    restaurant 
  });
});

// Get platters for a restaurant
app.get('/api/restaurants/:id/platters', (req, res) => {
  const id = req.params.id;
  const restaurantPlatters = platters[id] || [];

  res.json({
    success: true,
    count: restaurantPlatters.length,
    platters: restaurantPlatters
  });
});

// Get recommended platters
app.get('/api/restaurants/:id/platters/recommendations', (req, res) => {
  const id = req.params.id;
  const { budget, partySize, preferences } = req.query;
  const restaurantPlatters = platters[id] || [];

  if (!budget || !partySize) {
    return res.status(400).json({
      success: false,
      message: 'Budget and party size are required for recommendations'
    });
  }

  const budgetNum = parseFloat(budget);
  const partySizeNum = parseInt(partySize);
  const preferencesArray = preferences ? preferences.split(',') : [];

  // Simple recommendation algorithm
  let recommendations = restaurantPlatters.filter(platter => {
    // Check if price per person is within budget
    const pricePerPerson = platter.price / platter.servingSize;
    return pricePerPerson <= budgetNum;
  });

  // Filter by preferences if provided
  if (preferencesArray.length > 0) {
    const plattersWithPreferences = recommendations.filter(platter => 
      preferencesArray.some(pref => platter.tags.includes(pref))
    );

    // Only use preference-filtered platters if we have any
    if (plattersWithPreferences.length > 0) {
      recommendations = plattersWithPreferences;
    }
  }

  // Add a score to each recommendation
  recommendations = recommendations.map(platter => {
    // Budget utilization score (0-1)
    const pricePerPerson = platter.price / platter.servingSize;
    const budgetScore = pricePerPerson / budgetNum;

    // Serving efficiency score (0-1)
    const servingEfficiency = 1 - Math.abs(platter.servingSize - partySizeNum) / partySizeNum;
    const servingScore = servingEfficiency > 0 ? servingEfficiency : 0.1;

    // Combined score
    const score = (budgetScore * 0.6) + (servingScore * 0.4);

    return {
      ...platter,
      score: parseFloat(score.toFixed(2))
    };
  });

  // Sort by score (higher is better)
  recommendations.sort((a, b) => b.score - a.score);

  // Return top 3 recommendations
  recommendations = recommendations.slice(0, 3);

  res.json({
    success: true,
    count: recommendations.length,
    recommendations
  });
});

// Get addons for a restaurant
app.get('/api/restaurants/:id/addons', (req, res) => {
  const id = req.params.id;
  const restaurantAddons = addons[id] || [];

  res.json({
    success: true,
    count: restaurantAddons.length,
    addons: restaurantAddons
  });
});

// Get addon categories for a restaurant
app.get('/api/restaurants/:id/addons/categories', (req, res) => {
  const id = req.params.id;
  const restaurantAddons = addons[id] || [];

  // Extract unique categories
  const categoriesSet = new Set();
  restaurantAddons.forEach(addon => {
    categoriesSet.add(addon.category);
  });

  const categories = Array.from(categoriesSet);

  res.json({
    success: true,
    count: categories.length,
    categories
  });
});

// Get a specific platter by ID
app.get('/api/platters/:id', (req, res) => {
  const platterId = req.params.id;
  let platter = null;

  // Search for the platter in all restaurants
  for (const restaurantId in platters) {
    const found = platters[restaurantId].find(p => p.id === platterId);
    if (found) {
      platter = found;
      break;
    }
  }

  if (!platter) {
    return res.status(404).json({
      success: false,
      message: 'Platter not found'
    });
  }

  res.json({
    success: true,
    platter
  });
});

// Check restaurant availability
app.get('/api/restaurants/:id/availability', (req, res) => {
  const { id } = req.params;
  const { date, partySize } = req.query;

  if (!date || !partySize) {
    return res.status(400).json({
      success: false,
      message: 'Date and party size are required'
    });
  }

  // Demo availability data
  const availableSlots = [
    { time: '12:00', available: true },
    { time: '13:00', available: true },
    { time: '14:00', available: false },
    { time: '15:00', available: true },
    { time: '16:00', available: false },
    { time: '17:00', available: true },
    { time: '18:00', available: true },
    { time: '19:00', available: false },
    { time: '20:00', available: true },
    { time: '21:00', available: true }
  ];

  res.json({
    success: true,
    date,
    partySize,
    availableSlots
  });
});

// Auth route - send OTP
app.post('/api/auth/send-otp', (req, res) => {
  const { phoneNumber } = req.body;

  console.log(`[DEMO] Sending OTP to ${phoneNumber}. In demo mode, OTP is always 1234`);

  res.json({
    success: true,
    message: 'OTP sent successfully',
    verificationId: `${phoneNumber}-${Date.now()}`
  });
});

// Auth route - verify OTP
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

  res.json({
    success: true,
    message: 'OTP verified successfully',
    token: 'demo-token-12345',
    user
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});