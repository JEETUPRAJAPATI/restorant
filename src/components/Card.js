import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';

const Card = ({
  children,
  style = {},
  onPress = null,
  elevation = 2,
  radius = 8,
  padding = 16,
}) => {
  const cardStyle = [
    styles.card,
    {
      borderRadius: radius,
      padding: padding,
      elevation: elevation,
      shadowOpacity: elevation * 0.05,
      shadowRadius: elevation,
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.9}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    marginVertical: 8,
    marginHorizontal: 0,
  },
});

export default Card;
