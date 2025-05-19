import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import Card from './Card';

const AddonsCard = ({
  addon,
  onSelect,
  isSelected = false,
  isDisabled = false,
  quantity = 0,
  onIncrement,
  onDecrement,
}) => {
  const {
    id,
    name,
    image,
    description,
    price,
    category,
    isAvailable = true,
  } = addon;

  return (
    <Card
      style={[
        styles.card,
        isSelected && styles.selectedCard,
        (!isAvailable || isDisabled) && styles.disabledCard,
      ]}
      onPress={() => {
        if (isAvailable && !isDisabled && onSelect) {
          onSelect(id);
        }
      }}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        {category && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        )}
        {!isAvailable && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>Unavailable</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>${price.toFixed(2)}</Text>

          {isSelected ? (
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => onDecrement && onDecrement(id)}
                disabled={quantity <= 1 || isDisabled || !isAvailable}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => onIncrement && onIncrement(id)}
                disabled={isDisabled || !isAvailable}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.addButton,
                (!isAvailable || isDisabled) && styles.disabledButton,
              ]}
              onPress={() => {
                if (isAvailable && !isDisabled && onSelect) {
                  onSelect(id);
                }
              }}
              disabled={!isAvailable || isDisabled}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 12,
    flex: 1,
    maxWidth: '48%',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  disabledCard: {
    opacity: 0.7,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  categoryContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '500',
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 8,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  disabledButton: {
    backgroundColor: colors.lightGray,
  },
  addButtonText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgLight,
    borderRadius: 15,
    overflow: 'hidden',
  },
  quantityButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
    paddingHorizontal: 6,
  },
});

export default AddonsCard;
