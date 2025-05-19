const mongoose = require('mongoose');

const platterSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a platter name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  basePrice: {
    type: Number,
    required: [true, 'Please provide a base price']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price']
  },
  servingSize: {
    type: Number,
    required: [true, 'Please provide a serving size']
  },
  image: {
    type: String
  },
  isVeg: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  numRatings: {
    type: Number,
    default: 0
  },
  items: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    price: {
      type: Number,
      required: true
    },
    isVeg: {
      type: Boolean,
      default: false
    }
  }],
  isCustom: {
    type: Boolean,
    default: false
  },
  originalPlatterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Platter'
  },
  specialInstructions: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Platter', platterSchema);
