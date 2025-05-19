import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import Card from './Card';

const RestaurantCard = ({ 
  restaurant, 
  onPress, 
  showDistance = true,
  showRating = true,
  showAvailability = false,
  showFavorite = true,
  onToggleFavorite
}) => {
  const {
    id,
    name,
    image,
    cuisine,
    priceRange = 2,
    rating = 4.5,
    distance = 1.2,
    numReviews = 120,
    isFavorite = false,
    isAvailable = true,
  } = restaurant;

  const renderPriceRange = () => {
    const range = [];
    for (let i = 0; i < 4; i++) {
      range.push(
        <Text 
          key={i} 
          style={[
            styles.dollarSign, 
            i < priceRange ? styles.activeDollarSign : null
          ]}
        >
          $
        </Text>
      );
    }
    return <View style={styles.priceRangeContainer}>{range}</View>;
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: image }} 
        style={styles.image} 
        resizeMode="cover"
      />
      
      {showFavorite && (
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite && onToggleFavorite(id)}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? colors.error : colors.white} 
          />
        </TouchableOpacity>
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          {renderPriceRange()}
        </View>
        
        <Text style={styles.cuisine}>{cuisine}</Text>
        
        <View style={styles.infoContainer}>
          {showRating && (
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color={colors.yellow} />
              <Text style={styles.rating}>{rating.toFixed(1)}</Text>
              <Text style={styles.reviews}>({numReviews})</Text>
            </View>
          )}
          
          {showDistance && (
            <View style={styles.distanceContainer}>
              <Ionicons name="location-outline" size={16} color={colors.dark} />
              <Text style={styles.distance}>{distance.toFixed(1)} km</Text>
            </View>
          )}
        </View>
        
        {showAvailability && (
          <View style={[
            styles.availabilityContainer,
            !isAvailable && styles.unavailableContainer
          ]}>
            <View style={[
              styles.availabilityDot,
              !isAvailable && styles.unavailableDot
            ]} />
            <Text style={[
              styles.availabilityText,
              !isAvailable && styles.unavailableText
            ]}>
              {isAvailable ? 'Available for booking' : 'Unavailable for selected date'}
            </Text>
          </View>
        )}
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
  image: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    flex: 1,
    marginRight: 8,
  },
  priceRangeContainer: {
    flexDirection: 'row',
  },
  dollarSign: {
    fontSize: 14,
    color: colors.lightGray,
    marginHorizontal: 1,
  },
  activeDollarSign: {
    color: colors.primary,
  },
  cuisine: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    color: colors.dark,
    fontWeight: '500',
    fontSize: 14,
  },
  reviews: {
    color: colors.gray,
    fontSize: 12,
    marginLeft: 2,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    marginLeft: 4,
    color: colors.dark,
    fontSize: 14,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  unavailableContainer: {
    borderTopColor: colors.lightError,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  unavailableDot: {
    backgroundColor: colors.error,
  },
  availabilityText: {
    fontSize: 12,
    color: colors.success,
  },
  unavailableText: {
    color: colors.error,
  },
});

export default RestaurantCard;
