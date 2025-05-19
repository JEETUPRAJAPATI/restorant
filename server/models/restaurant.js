const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a restaurant name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Please provide an address'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  website: {
    type: String,
    trim: true
  },
  cuisine: {
    type: String,
    required: [true, 'Please provide a cuisine type'],
    trim: true
  },
  priceRange: {
    type: Number,
    required: [true, 'Please provide a price range'],
    min: 1,
    max: 4
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  location: {
    latitude: {
      type: Number,
      required: [true, 'Please provide latitude']
    },
    longitude: {
      type: Number,
      required: [true, 'Please provide longitude']
    }
  },
  hours: {
    monday: {
      open: String,
      close: String,
      isOpen: {
        type: Boolean,
        default: true
      }
    },
    tuesday: {
      open: String,
      close: String,
      isOpen: {
        type: Boolean,
        default: true
      }
    },
    wednesday: {
      open: String,
      close: String,
      isOpen: {
        type: Boolean,
        default: true
      }
    },
    thursday: {
      open: String,
      close: String,
      isOpen: {
        type: Boolean,
        default: true
      }
    },
    friday: {
      open: String,
      close: String,
      isOpen: {
        type: Boolean,
        default: true
      }
    },
    saturday: {
      open: String,
      close: String,
      isOpen: {
        type: Boolean,
        default: true
      }
    },
    sunday: {
      open: String,
      close: String,
      isOpen: {
        type: Boolean,
        default: true
      }
    }
  },
  features: [{
    name: String,
    icon: String
  }],
  eventTypes: [{
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    // 1: Birthday, 2: Anniversary, 3: Corporate, 4: Wedding, 5: Casual Gathering,
    // 6: Engagement, 7: Bachelor/Bachelorette, 8: Holiday, 9: Graduation, 10: Baby Shower
  }],
  maxPartySize: {
    type: Number,
    default: 50
  },
  minAdvanceBooking: {
    type: Number,
    default: 1 // in days
  },
  maxAdvanceBooking: {
    type: Number,
    default: 30 // in days
  },
  images: [{
    type: String
  }],
  menu: [{
    name: {
      type: String,
      required: true
    },
    items: [{
      name: {
        type: String,
        required: true
      },
      description: String,
      price: {
        type: Number,
        required: true
      }
    }]
  }],
  reviews: [{
    name: String,
    date: Date,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    text: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
