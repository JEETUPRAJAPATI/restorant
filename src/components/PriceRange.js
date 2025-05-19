import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { FontAwesome } from '@expo/vector-icons';

const PriceRange = ({ value = 2, onValueChange }) => {
  const priceRanges = [
    { id: 1, label: '$', description: 'Budget Friendly' },
    { id: 2, label: '$$', description: 'Moderately Priced' },
    { id: 3, label: '$$$', description: 'Premium' },
    { id: 4, label: '$$$$', description: 'Luxury' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.priceRangeContainer}>
        {priceRanges.map((range) => (
          <TouchableOpacity
            key={range.id}
            style={[
              styles.priceItem,
              value === range.id && styles.selectedPriceItem,
            ]}
            onPress={() => onValueChange(range.id)}
          >
            <Text
              style={[
                styles.priceText,
                value === range.id && styles.selectedPriceText,
              ]}
            >
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.priceDescription}>
        {priceRanges.find((p) => p.id === value)?.description || 'Select a price range'}
      </Text>
      
      <View style={styles.infoContainer}>
        <FontAwesome name="info-circle" size={16} color={colors.gray} />
        <Text style={styles.infoText}>
          Price ranges help us suggest appropriate venue and menu options for your event.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  priceRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.lightGray,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  selectedPriceItem: {
    backgroundColor: colors.primary,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  selectedPriceText: {
    color: colors.white,
  },
  priceDescription: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: colors.bgLight,
    borderRadius: 8,
  },
  infoText: {
    marginLeft: 8,
    color: colors.gray,
    fontSize: 12,
    flex: 1,
  },
});

export default PriceRange;
