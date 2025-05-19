import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Animated,
  Keyboard,
  Image
} from 'react-native';
import { colors } from '../constants/colors';
import Button from '../components/Button';
import CountryCodePicker from '../components/CountryCodePicker';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import Loading from '../components/Loading';
import { getRandomImage } from '../constants/images';

const AuthScreen = ({ navigation }) => {
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { loading, requestOTP, error } = useAuth();
  
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

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

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleContinue = async () => {
    if (!phoneNumber || phoneNumber.length < 8) {
      alert('Please enter a valid phone number');
      return;
    }

    const success = await requestOTP(phoneNumber, countryCode);
    if (success) {
      navigation.navigate('OTPVerification', {
        phoneNumber,
        countryCode,
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Loading visible={loading} text="Sending verification code..." />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={colors.dark} />
          </TouchableOpacity>

          {!isKeyboardVisible && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: getRandomImage('celebrationEvents') }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          )}

          <Text style={styles.title}>Login to your account</Text>
          <Text style={styles.subtitle}>
            We'll send a verification code to your phone to login or create a new account
          </Text>

          <View style={styles.inputContainer}>
            <CountryCodePicker
              selectedCode={countryCode}
              onSelectCode={setCountryCode}
              phoneNumber={phoneNumber}
              onChangePhoneNumber={setPhoneNumber}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <Button
            title="Continue"
            size="large"
            onPress={handleContinue}
            style={styles.continueButton}
            disabled={!phoneNumber || phoneNumber.length < 8}
          />

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
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
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 30,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 8,
  },
  continueButton: {
    marginBottom: 24,
  },
  termsContainer: {
    alignItems: 'center',
  },
  termsText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '500',
  },
});

export default AuthScreen;
