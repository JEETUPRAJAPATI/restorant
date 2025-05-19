import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { colors } from '../constants/colors';

const Button = ({ 
  title, 
  onPress, 
  type = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  style = {},
  textStyle = {}
}) => {
  
  const getButtonStyle = () => {
    let buttonStyle = [styles.button];
    
    // Button type
    if (type === 'primary') {
      buttonStyle.push(styles.primaryButton);
    } else if (type === 'secondary') {
      buttonStyle.push(styles.secondaryButton);
    } else if (type === 'outline') {
      buttonStyle.push(styles.outlineButton);
    } else if (type === 'text') {
      buttonStyle.push(styles.textButton);
    }
    
    // Button size
    if (size === 'small') {
      buttonStyle.push(styles.smallButton);
    } else if (size === 'large') {
      buttonStyle.push(styles.largeButton);
    }
    
    // Disabled state
    if (disabled) {
      buttonStyle.push(styles.disabledButton);
    }
    
    // Custom styles
    buttonStyle.push(style);
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let btnTextStyle = [styles.buttonText];
    
    // Text color based on button type
    if (type === 'primary') {
      btnTextStyle.push(styles.primaryButtonText);
    } else if (type === 'secondary') {
      btnTextStyle.push(styles.secondaryButtonText);
    } else if (type === 'outline') {
      btnTextStyle.push(styles.outlineButtonText);
    } else if (type === 'text') {
      btnTextStyle.push(styles.textButtonText);
    }
    
    // Text size based on button size
    if (size === 'small') {
      btnTextStyle.push(styles.smallButtonText);
    } else if (size === 'large') {
      btnTextStyle.push(styles.largeButtonText);
    }
    
    // Disabled state
    if (disabled) {
      btnTextStyle.push(styles.disabledButtonText);
    }
    
    // Custom text styles
    btnTextStyle.push(textStyle);
    
    return btnTextStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={type === 'primary' ? 'white' : colors.primary} 
        />
      ) : (
        <>
          {icon && icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  largeButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  disabledButton: {
    backgroundColor: colors.lightGray,
    borderColor: colors.lightGray,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  primaryButtonText: {
    color: colors.white,
  },
  secondaryButtonText: {
    color: colors.white,
  },
  outlineButtonText: {
    color: colors.primary,
  },
  textButtonText: {
    color: colors.primary,
  },
  smallButtonText: {
    fontSize: 14,
  },
  largeButtonText: {
    fontSize: 18,
  },
  disabledButtonText: {
    color: colors.gray,
  },
});

export default Button;
