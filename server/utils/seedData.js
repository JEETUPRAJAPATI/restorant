const User = require('../models/user');
const Restaurant = require('../models/restaurant');
const Platter = require('../models/platter');
const Addon = require('../models/addon');

// Sample data for development/demo purposes
const seedData = async () => {
  try {
    console.log('Seeding demo data...');
    
    // Check if data already exists
    const userCount = await User.countDocuments();
    const restaurantCount = await Restaurant.countDocuments();
    
    if (userCount > 0 || restaurantCount > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }
    
    // Create demo user
    const demoUser = await User.create({
      name: 'Demo User',
      phoneNumber: '+1234567890',
      email: 'demo@example.com',
      createdAt: new Date()
    });
    
    console.log('Created demo user');
    
    // Create demo restaurants
    const restaurants = await Restaurant.insertMany([
      {
        name: 'Spice Garden',
        description: 'Authentic Indian cuisine in a relaxed environment, perfect for celebrations.',
        address: '123 Main St, New York, NY 10001',
        phone: '+1234567891',
        email: 'info@spicegarden.com',
        website: 'www.spicegarden.com',
        cuisine: 'Indian',
        priceRange: 2,
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
          'https://example.com/spicegarden1.jpg',
          'https://example.com/spicegarden2.jpg',
          'https://example.com/spicegarden3.jpg'
        ],
        menu: [
          {
            name: 'Appetizers',
            items: [
              { name: 'Samosas', description: 'Crispy pastry filled with spiced potatoes', price: 6.99 },
              { name: 'Pakoras', description: 'Vegetable fritters', price: 5.99 }
            ]
          },
          {
            name: 'Main Courses',
            items: [
              { name: 'Butter Chicken', description: 'Chicken in a rich tomato sauce', price: 15.99 },
              { name: 'Vegetable Biryani', description: 'Fragrant rice with vegetables', price: 13.99 }
            ]
          }
        ],
        reviews: [
          { name: 'John D.', date: new Date('2023-01-15'), rating: 5, text: 'Amazing food and service!' },
          { name: 'Sarah M.', date: new Date('2023-02-20'), rating: 4, text: 'Great atmosphere for our anniversary dinner.' }
        ]
      },
      {
        name: 'Bella Italia',
        description: 'Family-style Italian restaurant with a warm atmosphere, ideal for family gatherings.',
        address: '456 Park Ave, New York, NY 10002',
        phone: '+1234567892',
        email: 'info@bellaitalia.com',
        website: 'www.bellaitalia.com',
        cuisine: 'Italian',
        priceRange: 3,
        rating: 4.7,
        numReviews: 150,
        location: {
          latitude: 40.7142,
          longitude: -74.0050
        },
        hours: {
          monday: { open: '12:00', close: '22:00', isOpen: true },
          tuesday: { open: '12:00', close: '22:00', isOpen: true },
          wednesday: { open: '12:00', close: '22:00', isOpen: true },
          thursday: { open: '12:00', close: '22:00', isOpen: true },
          friday: { open: '12:00', close: '23:30', isOpen: true },
          saturday: { open: '12:00', close: '23:30', isOpen: true },
          sunday: { open: '12:00', close: '22:00', isOpen: true }
        },
        features: [
          { name: 'Private Room', icon: 'room' },
          { name: 'Wine Cellar', icon: 'wine' },
          { name: 'Kids Area', icon: 'kids' }
        ],
        eventTypes: [1, 4, 5, 6], // Birthday, Wedding, Casual Gathering, Engagement
        maxPartySize: 80,
        images: [
          'https://example.com/bellaitalia1.jpg',
          'https://example.com/bellaitalia2.jpg',
          'https://example.com/bellaitalia3.jpg'
        ],
        menu: [
          {
            name: 'Antipasti',
            items: [
              { name: 'Bruschetta', description: 'Toasted bread with tomatoes and basil', price: 7.99 },
              { name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and basil', price: 9.99 }
            ]
          },
          {
            name: 'Pasta',
            items: [
              { name: 'Spaghetti Carbonara', description: 'Classic carbonara with pancetta', price: 16.99 },
              { name: 'Lasagna', description: 'Layered pasta with beef and cheese', price: 18.99 }
            ]
          }
        ],
        reviews: [
          { name: 'Michael P.', date: new Date('2023-03-10'), rating: 5, text: 'Best Italian food in the city!' },
          { name: 'Jessica R.', date: new Date('2023-04-05'), rating: 4, text: 'Great for our family birthday celebration.' }
        ]
      },
      {
        name: 'Sushi Palace',
        description: 'Modern Japanese restaurant with private dining options for special occasions.',
        address: '789 Broadway, New York, NY 10003',
        phone: '+1234567893',
        email: 'info@sushipalace.com',
        website: 'www.sushipalace.com',
        cuisine: 'Japanese',
        priceRange: 4,
        rating: 4.8,
        numReviews: 200,
        location: {
          latitude: 40.7135,
          longitude: -74.0040
        },
        hours: {
          monday: { open: '17:00', close: '23:00', isOpen: true },
          tuesday: { open: '17:00', close: '23:00', isOpen: true },
          wednesday: { open: '17:00', close: '23:00', isOpen: true },
          thursday: { open: '17:00', close: '23:00', isOpen: true },
          friday: { open: '17:00', close: '24:00', isOpen: true },
          saturday: { open: '12:00', close: '24:00', isOpen: true },
          sunday: { open: '12:00', close: '22:00', isOpen: true }
        },
        features: [
          { name: 'Private Dining', icon: 'dining' },
          { name: 'Sake Bar', icon: 'bar' },
          { name: 'Chef\'s Table', icon: 'chef' }
        ],
        eventTypes: [2, 3, 7, 9], // Anniversary, Corporate, Bachelor/Bachelorette, Graduation
        maxPartySize: 40,
        images: [
          'https://example.com/sushipalace1.jpg',
          'https://example.com/sushipalace2.jpg',
          'https://example.com/sushipalace3.jpg'
        ],
        menu: [
          {
            name: 'Starters',
            items: [
              { name: 'Edamame', description: 'Steamed soybeans with salt', price: 5.99 },
              { name: 'Miso Soup', description: 'Traditional Japanese soup', price: 4.99 }
            ]
          },
          {
            name: 'Sushi & Sashimi',
            items: [
              { name: 'Sushi Platter', description: 'Chef\'s selection of fresh sushi', price: 28.99 },
              { name: 'Sashimi Deluxe', description: 'Assorted fresh sashimi', price: 32.99 }
            ]
          }
        ],
        reviews: [
          { name: 'David L.', date: new Date('2023-01-25'), rating: 5, text: 'Incredible sushi and perfect for our anniversary!' },
          { name: 'Michelle K.', date: new Date('2023-03-15'), rating: 5, text: 'The private dining room was perfect for our corporate event.' }
        ]
      }
    ]);
    
    console.log(`Created ${restaurants.length} demo restaurants`);
    
    // Create demo platters for each restaurant
    for (const restaurant of restaurants) {
      const platters = await Platter.insertMany([
        {
          restaurantId: restaurant._id,
          name: `${restaurant.name} Party Platter Small`,
          description: `Perfect for small gatherings of 4-6 people featuring ${restaurant.cuisine} specialties.`,
          basePrice: 49.99,
          price: 49.99,
          servingSize: 5,
          isVeg: false,
          tags: ['party', 'popular'],
          rating: 4.5,
          numRatings: 25,
          items: [
            { id: '1', name: 'Appetizer Sampler', description: 'Selection of popular appetizers', price: 14.99, isVeg: false },
            { id: '2', name: 'Main Course Selection', description: 'Signature dishes', price: 24.99, isVeg: false },
            { id: '3', name: 'Side Dishes', description: 'Accompaniments and sides', price: 10.01, isVeg: true }
          ]
        },
        {
          restaurantId: restaurant._id,
          name: `${restaurant.name} Party Platter Medium`,
          description: `Great for medium-sized events of 8-12 people with a variety of ${restaurant.cuisine} dishes.`,
          basePrice: 89.99,
          price: 89.99,
          servingSize: 10,
          isVeg: false,
          tags: ['party', 'popular', 'value'],
          rating: 4.7,
          numRatings: 35,
          items: [
            { id: '1', name: 'Appetizer Sampler', description: 'Selection of popular appetizers', price: 24.99, isVeg: false },
            { id: '2', name: 'Main Course Selection', description: 'Signature dishes', price: 44.99, isVeg: false },
            { id: '3', name: 'Side Dishes', description: 'Accompaniments and sides', price: 20.01, isVeg: true }
          ]
        },
        {
          restaurantId: restaurant._id,
          name: `${restaurant.name} Party Platter Large`,
          description: `Ideal for large gatherings of 15-20 people with comprehensive ${restaurant.cuisine} menu options.`,
          basePrice: 149.99,
          price: 149.99,
          servingSize: 18,
          isVeg: false,
          tags: ['party', 'large', 'catering'],
          rating: 4.8,
          numRatings: 20,
          items: [
            { id: '1', name: 'Appetizer Sampler', description: 'Selection of popular appetizers', price: 39.99, isVeg: false },
            { id: '2', name: 'Main Course Selection', description: 'Signature dishes', price: 74.99, isVeg: false },
            { id: '3', name: 'Side Dishes', description: 'Accompaniments and sides', price: 35.01, isVeg: true }
          ]
        },
        {
          restaurantId: restaurant._id,
          name: `${restaurant.name} Vegetarian Platter`,
          description: `Complete vegetarian option for 8-10 people featuring ${restaurant.cuisine} vegetarian specialties.`,
          basePrice: 79.99,
          price: 79.99,
          servingSize: 9,
          isVeg: true,
          tags: ['vegetarian', 'healthy', 'party'],
          rating: 4.6,
          numRatings: 15,
          items: [
            { id: '1', name: 'Vegetarian Appetizers', description: 'Selection of vegetarian starters', price: 19.99, isVeg: true },
            { id: '2', name: 'Vegetarian Main Dishes', description: 'Signature vegetarian entrees', price: 39.99, isVeg: true },
            { id: '3', name: 'Vegetarian Sides', description: 'Accompaniments and sides', price: 20.01, isVeg: true }
          ]
        }
      ]);
      
      console.log(`Created ${platters.length} platters for ${restaurant.name}`);
      
      // Create demo addons for each restaurant
      const addons = await Addon.insertMany([
        {
          restaurantId: restaurant._id,
          name: 'Live Music',
          description: 'Professional musicians performing for your event',
          price: 149.99,
          category: 'Entertainment',
          isVeg: true,
          isAvailable: true,
          compatiblePlatters: platters.map(p => p._id)
        },
        {
          restaurantId: restaurant._id,
          name: 'Party Decorations',
          description: 'Balloons, banners, and themed decor for your event',
          price: 99.99,
          category: 'Decor',
          isVeg: true,
          isAvailable: true,
          compatiblePlatters: platters.map(p => p._id)
        },
        {
          restaurantId: restaurant._id,
          name: 'Custom Cake',
          description: 'Personalized celebration cake with your choice of flavor',
          price: 49.99,
          category: 'Food',
          isVeg: true,
          isAvailable: true,
          compatiblePlatters: platters.map(p => p._id)
        },
        {
          restaurantId: restaurant._id,
          name: 'Photography Package',
          description: 'Professional photographer for 2 hours',
          price: 199.99,
          category: 'Services',
          isVeg: true,
          isAvailable: true,
          compatiblePlatters: platters.map(p => p._id)
        }
      ]);
      
      console.log(`Created ${addons.length} addons for ${restaurant.name}`);
    }
    
    console.log('Demo data seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;