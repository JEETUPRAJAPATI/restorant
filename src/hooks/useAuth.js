import { useState, useEffect, useCallback, useContext } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../store/authContext';
import { sendOTP, verifyOTP } from '../api/auth';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState(null);
  const { user, setUser, token, setToken, logout } = useContext(AuthContext);

  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      setLoading(true);
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('userData');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Authentication retrieval error:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestOTP = async (phoneNum, countryCode) => {
    try {
      setLoading(true);
      setError(null);
      
      const fullPhoneNumber = `${countryCode}${phoneNum}`;
      setPhoneNumber(fullPhoneNumber);
      
      // Call API to send OTP
      const response = await sendOTP(fullPhoneNumber);
      
      if (response.success) {
        setVerificationId(response.verificationId);
        setOtpSent(true);
        return true;
      } else {
        setError(response.message || 'Failed to send OTP');
        return false;
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to send OTP';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneNumber = async (otp) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!verificationId || !phoneNumber) {
        setError('Missing verification information');
        return false;
      }
      
      // Call API to verify OTP
      const response = await verifyOTP(phoneNumber, otp);
      
      if (response.success) {
        // Store auth data
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        
        // Update context
        setToken(response.token);
        setUser(response.user);
        return true;
      } else {
        setError(response.message || 'Invalid OTP');
        return false;
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to verify OTP';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      
      logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  }, [logout]);

  return {
    loading,
    user,
    token,
    error,
    otpSent,
    phoneNumber,
    verificationId,
    requestOTP,
    verifyPhoneNumber,
    logout: handleLogout,
    isAuthenticated: !!token,
  };
};

export default useAuth;
