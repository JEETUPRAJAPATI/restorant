const mongoose = require('mongoose');

const addonSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide an addon name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true
  },
  image: {
    type: String
  },
  isVeg: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  compatiblePlatters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Platter'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Addon', addonSchema);
