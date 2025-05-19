const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendOTPMessage } = require('../utils/twilio');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// Store OTPs temporarily (in a real app, this would be in a database or redis)
const otpStore = {};

/**
 * Send OTP to phone number
 * @route POST /api/auth/send-otp
 */
exports.sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }
    
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP for verification (with 10-minute expiry)
    const verificationId = `${phoneNumber}-${Date.now()}`;
    otpStore[verificationId] = {
      phoneNumber,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };
    
    // Send OTP via Twilio
    try {
      await sendOTPMessage(phoneNumber, otp);
    } catch (error) {
      console.error('Twilio Error:', error);
      // For development: still return success even if Twilio fails
      // In production, you would handle this differently
    }
    
    // In development mode, log the OTP for testing
    console.log(`OTP for ${phoneNumber}: ${otp}`);
    
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      verificationId
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message
    });
  }
};

/**
 * Verify OTP
 * @route POST /api/auth/verify-otp
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }
    
    // Demo mode - accept "1234" as valid OTP for any phone number
    if (otp === '1234') {
      console.log(`[DEMO MODE] Accepting demo OTP for ${phoneNumber}`);
      // Continue to user creation/login flow
    } else {
      // Regular OTP verification flow
      // Find the latest verification for this phone number
      const verificationIds = Object.keys(otpStore)
        .filter(id => id.startsWith(phoneNumber))
        .sort((a, b) => parseInt(b.split('-')[1]) - parseInt(a.split('-')[1]));
      
      if (verificationIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No OTP verification found for this phone number'
        });
      }
      
      const currentVerificationId = verificationIds[0];
      const verification = otpStore[currentVerificationId];
      
      // Check if OTP has expired
      if (verification.expiresAt < Date.now()) {
        delete otpStore[currentVerificationId];
        return res.status(400).json({
          success: false,
          message: 'OTP has expired. Please request a new one.'
        });
      }
      
      // Verify OTP
      if (verification.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP'
        });
      }
      
      // Clean up the OTP from store if we're using a real OTP
      delete otpStore[currentVerificationId];
    }
    
    // OTP is valid, continue with login/registration flow
    
    // Find or create user
    let user = await User.findOne({ phoneNumber });
    
    if (!user) {
      // Create new user
      user = await User.create({
        phoneNumber,
        name: `User${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date()
      });
    }
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email || null,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
};

/**
 * Register a new user
 * @route POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { name, phoneNumber, email } = req.body;
    
    if (!name || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone number are required'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this phone number'
      });
    }
    
    // Create new user
    const user = await User.create({
      name,
      phoneNumber,
      email,
      createdAt: new Date()
    });
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email || null,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message
    });
  }
};

/**
 * Login with phone number (starts OTP process)
 * @route POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }
    
    // Check if user exists
    const user = await User.findOne({ phoneNumber });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.'
      });
    }
    
    // For actual login, we redirect to the OTP flow
    // So we'll just return success and let the client handle the flow
    res.status(200).json({
      success: true,
      message: 'User found. Proceed with OTP verification.',
      phoneNumber
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: error.message
    });
  }
};

/**
 * Protect routes - middleware to verify JWT token
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    
    next();
  };
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
      error: error.message
    });
  }
};

/**
 * Get user profile
 * @route GET /api/auth/profile
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/auth/profile
 */
exports.adminRegister = async (req, res) => {
  try {
    const { restaurantName, name, email, password } = req.body;
    
    if (!restaurantName || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
      createdAt: new Date()
    });

    // Create associated restaurant
    const restaurant = await Restaurant.create({
      name: restaurantName,
      admin: user._id,
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Admin Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register',
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-__v');
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
      error: error.message
    });
  }
};
