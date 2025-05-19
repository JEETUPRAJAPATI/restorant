const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide a phone number'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ],
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  bookings: [{
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    partySize: {
      type: Number,
      required: true
    },
    eventName: {
      type: String,
      required: true
    },
    platters: [{
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Platter'
      },
      name: String,
      price: Number,
      quantity: {
        type: Number,
        default: 1
      }
    }],
    addons: [{
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Addon'
      },
      name: String,
      price: Number,
      quantity: {
        type: Number,
        default: 1
      }
    }],
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    totalAmount: {
      type: Number,
      required: true
    },
    specialInstructions: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('User', userSchema);