const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');

/**
 * @route POST /api/auth/send-otp
 * @desc Send OTP to phone number
 * @access Public
 */
router.post('/send-otp', (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }
    
    // Normalize phone number (remove spaces, dashes, etc.)
    const normalizedPhone = phoneNumber.replace(/\D/g, '');
    
    // Send OTP
    auth.sendOTP(normalizedPhone);
    
    res.json({
      success: true,
      message: 'OTP sent successfully',
      dummyOTP: process.env.NODE_ENV === 'development' ? '1234' : undefined
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP'
    });
  }
});

/**
 * @route POST /api/auth/verify-otp
 * @desc Verify OTP received
 * @access Public
 */
router.post('/verify-otp', (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }
    
    // Normalize phone number
    const normalizedPhone = phoneNumber.replace(/\D/g, '');
    
    // Verify OTP
    const isValid = auth.verifyOTP(normalizedPhone, otp);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
    
    // Get user if exists
    const user = auth.getUserByPhone(normalizedPhone);
    
    // Generate token
    let token = null;
    if (user) {
      token = auth.generateToken(user);
    }
    
    res.json({
      success: true,
      message: 'OTP verified successfully',
      isRegistered: !!user,
      token
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP'
    });
  }
});

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', (req, res) => {
  try {
    const { phoneNumber, name, email } = req.body;
    
    if (!phoneNumber || !name) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and name are required'
      });
    }
    
    // Normalize phone number
    const normalizedPhone = phoneNumber.replace(/\D/g, '');
    
    // Create user
    const result = auth.createUser({
      phoneNumber: normalizedPhone,
      name,
      email
    });
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }
    
    // Generate token
    const token = auth.generateToken(result.user);
    
    res.json({
      success: true,
      message: 'User registered successfully',
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user'
    });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login user with phone number (starts OTP process)
 * @access Public
 */
router.post('/login', (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }
    
    // Normalize phone number
    const normalizedPhone = phoneNumber.replace(/\D/g, '');
    
    // Check if user exists
    const user = auth.getUserByPhone(normalizedPhone);
    
    // Send OTP regardless of whether user exists (for security)
    auth.sendOTP(normalizedPhone);
    
    res.json({
      success: true,
      message: 'OTP sent successfully',
      isRegistered: !!user,
      dummyOTP: process.env.NODE_ENV === 'development' ? '1234' : undefined
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in'
    });
  }
});

/**
 * Middleware to verify JWT token
 */
const protect = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }
    
    // Verify token
    const decoded = auth.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }
    
    // Get user
    const user = auth.getUserByPhone(decoded.phoneNumber);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Set user in request
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(401).json({
      success: false,
      message: 'Not authorized'
    });
  }
};

/**
 * @route GET /api/auth/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', protect, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = {
  router,
  protect
};