import { DefaultTheme } from 'react-native-paper';
import { colors } from './colors';

export const theme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.bgLight,
    text: colors.dark,
    placeholder: colors.gray,
    error: colors.error,
    surface: colors.white,
    notification: colors.error,
  },
  font: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  shadow: {
    small: {
      shadowColor: colors.dark,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: colors.dark,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    large: {
      shadowColor: colors.dark,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
  },
  animation: {
    scale: 1.0,
    timing: {
      fast: 150,
      normal: 300,
      slow: 450,
    },
  },
};

export const navigationTheme = {
  dark: false,
  colors: {
    primary: colors.primary,
    background: colors.white,
    card: colors.white,
    text: colors.dark,
    border: colors.lightGray,
    notification: colors.primary,
  },
};
