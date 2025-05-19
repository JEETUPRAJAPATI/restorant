import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const sendOTP = async (phoneNumber) => {
  try {
    const response = await axios.post(`${API_URL}/auth/send-otp`, {
      phoneNumber,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to send OTP');
  }
};

export const verifyOTP = async (phoneNumber, otp) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-otp`, {
      phoneNumber,
      otp,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to verify OTP');
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to register user');
  }
};

export const loginUser = async (phoneNumber) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      phoneNumber,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to login');
  }
};
