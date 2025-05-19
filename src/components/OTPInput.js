import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, Keyboard } from 'react-native';
import { colors } from '../constants/colors';

const OTPInput = ({ length = 6, value = '', onChange, error = null }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (value) {
      const valueArray = value.split('').slice(0, length);
      const newOtp = [...Array(length).fill('')];
      
      valueArray.forEach((char, index) => {
        newOtp[index] = char;
      });
      
      setOtp(newOtp);
    }
  }, [value, length]);

  const handleChange = (text, index) => {
    // Allow only numeric input
    if (!/^[0-9]?$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Notify parent component
    onChange(newOtp.join(''));

    // Auto-focus next input if we have a value
    if (text && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleFocus = (index) => {
    // If focusing an input after filled inputs, move focus to first empty input
    for (let i = 0; i < index; i++) {
      if (!otp[i]) {
        inputRefs.current[i].focus();
        return;
      }
    }
  };

  const handlePaste = (text) => {
    // Extract digits only
    const digits = text.replace(/\D/g, '').split('').slice(0, length);
    const newOtp = [...Array(length).fill('')];
    
    digits.forEach((digit, index) => {
      newOtp[index] = digit;
    });
    
    setOtp(newOtp);
    onChange(newOtp.join(''));
    
    // Focus on the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(val => val === '');
    if (nextEmptyIndex >= 0) {
      inputRefs.current[nextEmptyIndex].focus();
    } else if (inputRefs.current[length - 1]) {
      inputRefs.current[length - 1].focus();
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {Array(length)
          .fill(0)
          .map((_, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.input,
                error && styles.inputError,
                otp[index] && styles.inputFilled,
              ]}
              maxLength={1}
              keyboardType="numeric"
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => handleFocus(index)}
              value={otp[index]}
              autoFocus={index === 0}
              onTextInput={(e) => {
                // Check for paste event
                const { text } = e.nativeEvent;
                if (text.length > 1) {
                  handlePaste(text);
                }
              }}
            />
          ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    width: 48,
    height: 52,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: colors.dark,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  inputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.lightPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default OTPInput;
