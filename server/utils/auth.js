const jwt = require('jsonwebtoken');

// Secret key for JWT token generation (should be in environment variable in production)
const JWT_SECRET = 'your_jwt_secret_key';

// In-memory storage for OTPs and users (in a real app, this would be a database)
const otpStorage = new Map();
const users = new Map();

// Generate a random OTP code (4 digits for simplicity)
const generateOTP = () => {
  // For testing, always return "1234" as the OTP code
  if (process.env.NODE_ENV === 'development') {
    return '1234';
  }
  // In production, generate a random 4-digit code
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Send OTP to a phone number (dummy implementation)
const sendOTP = (phoneNumber) => {
  // Generate OTP
  const otp = generateOTP();
  
  // Store OTP with expiration time (5 minutes)
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStorage.set(phoneNumber, {
    otp,
    expiresAt
  });
  
  // In a real implementation, this would send an SMS via Twilio or similar service
  console.log(`Dummy OTP sent to ${phoneNumber}: ${otp}`);
  
  return true;
};

// Verify OTP for a phone number
const verifyOTP = (phoneNumber, otp) => {
  // Get stored OTP details
  const storedOTP = otpStorage.get(phoneNumber);
  
  // Check if OTP exists and is valid
  if (!storedOTP) {
    return false;
  }
  
  // Check if OTP has expired
  if (storedOTP.expiresAt < Date.now()) {
    otpStorage.delete(phoneNumber);
    return false;
  }
  
  // Check if OTP matches
  const isValid = storedOTP.otp === otp;
  
  // Remove OTP after verification attempt (one-time use)
  otpStorage.delete(phoneNumber);
  
  return isValid;
};

// Create a new user
const createUser = (userData) => {
  // Check if user already exists
  if (users.has(userData.phoneNumber)) {
    return { success: false, message: 'User already exists' };
  }
  
  // Create user object with timestamp
  const user = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Store user in map
  users.set(userData.phoneNumber, user);
  
  return { success: true, user };
};

// Get user by phone number
const getUserByPhone = (phoneNumber) => {
  return users.get(phoneNumber);
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, phoneNumber: user.phoneNumber },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  createUser,
  getUserByPhone,
  generateToken,
  verifyToken
};