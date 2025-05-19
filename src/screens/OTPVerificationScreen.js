import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
} from 'react-native';
import { colors } from '../constants/colors';
import Button from '../components/Button';
import OTPInput from '../components/OTPInput';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import Loading from '../components/Loading';

const OTPVerificationScreen = ({ navigation, route }) => {
  const { phoneNumber, countryCode } = route.params;
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { loading, verifyPhoneNumber, requestOTP } = useAuth();
  
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const timerRef = useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    startTimer();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const startTimer = () => {
    setTimeLeft(60);
    setCanResend(false);
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    const success = await verifyPhoneNumber(otp);
    if (success) {
      // Navigation will happen automatically through the navigation container
    }
  };

  const handleResendOTP = async () => {
    if (canResend) {
      const success = await requestOTP(phoneNumber, countryCode);
      if (success) {
        startTimer();
      }
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Loading visible={loading} text="Verifying code..." />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>

        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to {countryCode} {phoneNumber}
        </Text>

        <View style={styles.otpContainer}>
          <OTPInput
            length={6}
            value={otp}
            onChange={setOtp}
          />
        </View>

        <Button
          title="Verify & Proceed"
          size="large"
          onPress={handleVerify}
          style={styles.verifyButton}
          disabled={otp.length !== 6}
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResendOTP}>
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timer}>Resend in {formatTime(timeLeft)}</Text>
          )}
        </View>

        {!isKeyboardVisible && (
          <View style={styles.securityContainer}>
            <View style={styles.securityIcon}>
              <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
            </View>
            <Text style={styles.securityText}>
              Your personal data is securely handled according to our privacy policy
            </Text>
          </View>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 40,
    lineHeight: 22,
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  verifyButton: {
    marginBottom: 24,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  resendText: {
    fontSize: 14,
    color: colors.gray,
  },
  resendLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  timer: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '500',
  },
  securityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightPrimary,
    padding: 16,
    borderRadius: 12,
    marginTop: 'auto',
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  securityText: {
    fontSize: 14,
    color: colors.dark,
    flex: 1,
    lineHeight: 20,
  },
});

export default OTPVerificationScreen;
