import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import Card from './Card';

const PlattersCard = ({
  platter,
  onPress,
  isRecommended = false,
  selectable = false,
  isSelected = false,
  onSelect,
  showAddCustomize = false,
  onCustomize,
}) => {
  const {
    id,
    name,
    image,
    description,
    price,
    servingSize,
    tags = [],
    isVeg = false,
    rating = 4.5,
    numRatings = 12,
    isWithinBudget = true,
  } = platter;

  return (
    <Card style={[styles.card, isSelected && styles.selectedCard]} onPress={onPress}>
      {isRecommended && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>Recommended</Text>
        </View>
      )}

      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        <View style={styles.servingContainer}>
          <Ionicons name="people" size={16} color={colors.white} />
          <Text style={styles.servingText}>Serves {servingSize}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            {isVeg && (
              <View style={styles.vegBadge}>
                <View style={styles.vegIcon} />
              </View>
            )}
          </View>
          
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={12} color={colors.yellow} />
            <Text style={styles.rating}>{rating}</Text>
            <Text style={styles.numRatings}>({numRatings})</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={[
              styles.price,
              !isWithinBudget && styles.exceedsBudgetPrice
            ]}>
              ${price.toFixed(2)}
            </Text>
            {!isWithinBudget && (
              <Text style={styles.budgetWarning}>Exceeds budget</Text>
            )}
          </View>

          {selectable ? (
            <TouchableOpacity
              style={[styles.selectButton, isSelected && styles.selectedButton]}
              onPress={() => onSelect && onSelect(id)}
            >
              {isSelected ? (
                <>
                  <Ionicons name="checkmark" size={16} color={colors.white} />
                  <Text style={styles.selectedButtonText}>Selected</Text>
                </>
              ) : (
                <Text style={styles.selectButtonText}>Select</Text>
              )}
            </TouchableOpacity>
          ) : showAddCustomize ? (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.customizeButton}
                onPress={() => onCustomize && onCustomize(id)}
              >
                <Text style={styles.customizeButtonText}>Customize</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 16,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 10,
    left: 0,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    zIndex: 1,
  },
  recommendedText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  servingContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  servingText: {
    color: colors.white,
    fontSize: 12,
    marginLeft: 4,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    flex: 1,
    marginRight: 8,
  },
  vegBadge: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  vegIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: colors.dark,
    marginLeft: 2,
  },
  numRatings: {
    fontSize: 10,
    color: colors.gray,
    marginLeft: 2,
  },
  description: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 10,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: colors.bgLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: colors.gray,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  exceedsBudgetPrice: {
    color: colors.error,
  },
  budgetWarning: {
    fontSize: 10,
    color: colors.error,
  },
  selectButton: {
    backgroundColor: colors.bgLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: colors.primary,
  },
  selectButtonText: {
    fontSize: 14,
    color: colors.dark,
  },
  selectedButtonText: {
    fontSize: 14,
    color: colors.white,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  customizeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  customizeButtonText: {
    fontSize: 14,
    color: colors.white,
  },
});

export default PlattersCard;
