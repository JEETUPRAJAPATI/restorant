const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Demo mode flag - set to true to use fixed OTP regardless of Twilio credentials
const DEMO_MODE = true;
const DEMO_OTP = '1234';

// Get Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client if credentials are available and not in demo mode
let client;
if (!DEMO_MODE && accountSid && authToken) {
  // Only require twilio if we're actually using it
  const twilio = require('twilio');
  client = twilio(accountSid, authToken);
} else {
  console.warn('Running in demo mode. Fixed OTP "1234" will be used for all verifications.');
}

/**
 * Send an SMS message via Twilio
 * @param {string} to - Recipient phone number
 * @param {string} message - Message content
 * @returns {Promise} Twilio message response
 */
const sendMessage = async (to, message) => {
  try {
    if (!client) {
      console.log(`[SIMULATED SMS] To: ${to}, Message: ${message}`);
      return {
        sid: 'SIMULATED_SID',
        status: 'simulated'
      };
    }

    const twilioMessage = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to
    });

    console.log(`Message sent with SID: ${twilioMessage.sid}`);
    return twilioMessage;
  } catch (error) {
    console.error('Error sending Twilio message:', error);
    throw error;
  }
};

/**
 * Send OTP message for verification
 * @param {string} to - Recipient phone number
 * @param {string} otp - One-time password
 * @returns {Promise} Twilio message response
 */
const sendOTPMessage = async (to, otp) => {
  // In demo mode, ignore the provided OTP and use the fixed demo OTP
  const otpToSend = DEMO_MODE ? DEMO_OTP : otp;
  const message = `Your TableFete verification code is: ${otpToSend}. This code will expire in 10 minutes.`;
  console.log(`[DEMO MODE] OTP for ${to}: ${otpToSend}`);
  return sendMessage(to, message);
};

/**
 * Send booking confirmation message
 * @param {string} to - Recipient phone number
 * @param {object} booking - Booking details
 * @returns {Promise} Twilio message response
 */
const sendBookingConfirmation = async (to, booking) => {
  const { eventName, restaurantName, date, time } = booking;
  const formattedDate = new Date(date).toLocaleDateString();
  
  const message = `Your TableFete booking for "${eventName}" at ${restaurantName} is confirmed for ${formattedDate} at ${time}. Thanks for using TableFete!`;
  return sendMessage(to, message);
};

module.exports = {
  sendMessage,
  sendOTPMessage,
  sendBookingConfirmation
};
