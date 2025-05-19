import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Linking,
  StatusBar,
  Share,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { getRestaurantById, getRestaurantMenu, getRestaurantReviews } from '../api/restaurants';
import { colors } from '../constants/colors';
import Button from '../components/Button';
import Card from '../components/Card';
import Loading from '../components/Loading';
import { getRandomImage } from '../constants/images';
import { formatDate, formatTime } from '../utils/helpers';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const RestaurantDetailScreen = ({ route, navigation }) => {
  const { id, name, image } = route.params;
  
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [partySize, setPartySize] = useState(4);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(0);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });
  
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });
  
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    fetchRestaurantDetails();
  }, []);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const [restaurantData, menuData, reviewsData] = await Promise.all([
        getRestaurantById(id),
        getRestaurantMenu(id),
        getRestaurantReviews(id),
      ]);

      setRestaurant(restaurantData);
      setMenu(menuData);
      setReviews(reviewsData);
    } catch (err) {
      setError('Failed to load restaurant details. Please try again.');
      console.error('Error fetching restaurant details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPlanning = () => {
    navigation.navigate('Platters', {
      restaurantId: id,
      restaurantName: restaurant?.name || name,
      partySize,
    });
  };

  const handleSharePress = async () => {
    try {
      await Share.share({
        message: `Check out ${restaurant?.name || name} on TableFete! Great place for events!`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleDirectionsPress = () => {
    if (restaurant?.location?.latitude && restaurant?.location?.longitude) {
      const scheme = Platform.select({
        ios: 'maps:',
        android: 'geo:',
      });
      const latLng = `${restaurant.location.latitude},${restaurant.location.longitude}`;
      const label = restaurant.name;
      const url = Platform.select({
        ios: `${scheme}ll=${latLng}&q=${label}`,
        android: `${scheme}0,0?q=${latLng}(${label})`,
      });

      Linking.openURL(url);
    }
  };

  const handleCallPress = () => {
    if (restaurant?.phone) {
      Linking.openURL(`tel:${restaurant.phone}`);
    }
  };

  const incrementPartySize = () => {
    if (partySize < 50) {
      setPartySize(partySize + 1);
    }
  };

  const decrementPartySize = () => {
    if (partySize > 1) {
      setPartySize(partySize - 1);
    }
  };

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          height: headerHeight,
        },
      ]}
    >
      <Animated.Image
        source={{ uri: image || restaurant?.image || getRandomImage('restaurantInteriors') }}
        style={[
          styles.headerImage,
          {
            opacity: headerOpacity,
            transform: [{ translateY: imageTranslateY }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.headerOverlay,
          {
            opacity: headerOpacity,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{restaurant?.name || name}</Text>
          <View style={styles.headerInfoRow}>
            <View style={styles.headerInfo}>
              <Ionicons name="location-outline" size={16} color={colors.white} />
              <Text style={styles.headerInfoText} numberOfLines={1}>
                {restaurant?.address || 'Loading address...'}
              </Text>
            </View>
            <View style={styles.headerInfo}>
              <Ionicons name="star" size={16} color={colors.yellow} />
              <Text style={styles.headerInfoText}>
                {restaurant?.rating?.toFixed(1) || '4.5'} ({restaurant?.numReviews || '120'})
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <View style={styles.headerBarContainer}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>

          <Animated.Text
            style={[
              styles.headerBarTitle,
              {
                opacity: titleOpacity,
              },
            ]}
            numberOfLines={1}
          >
            {restaurant?.name || name}
          </Animated.Text>

          <View style={styles.headerRightButtons}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleSharePress}
            >
              <Ionicons name="share-outline" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderPriceRange = () => {
    const range = [];
    const priceRange = restaurant?.priceRange || 2;
    
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
    
    return (
      <View style={styles.priceRangeContainer}>
        {range}
      </View>
    );
  };

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
        onPress={() => setActiveTab('overview')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'overview' && styles.activeTabText,
          ]}
        >
          Overview
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'menu' && styles.activeTab]}
        onPress={() => setActiveTab('menu')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'menu' && styles.activeTabText,
          ]}
        >
          Menu
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
        onPress={() => setActiveTab('reviews')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'reviews' && styles.activeTabText,
          ]}
        >
          Reviews
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>
          {restaurant?.description ||
            'This restaurant offers a perfect space for hosting memorable events. From intimate gatherings to large celebrations, their dedicated staff ensures a seamless experience.'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.galleryContainer}
        >
          {restaurant?.gallery?.length > 0
            ? restaurant.gallery.map((photo, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.galleryItem}
                  onPress={() => {
                    setSelectedGalleryImage(index);
                    setGalleryVisible(true);
                  }}
                >
                  <Image
                    source={{ uri: photo }}
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))
            : Array.from({ length: 4 }).map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.galleryItem}
                  onPress={() => {
                    setSelectedGalleryImage(index);
                    setGalleryVisible(true);
                  }}
                >
                  <Image
                    source={{ uri: getRandomImage('restaurantInteriors') }}
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
        </ScrollView>
      </View>

      <Card style={styles.eventCard}>
        <Text style={styles.eventCardTitle}>Special Events Features</Text>
        <View style={styles.featuresGrid}>
          {(restaurant?.features || defaultFeatures).map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon} size={20} color={colors.primary} />
              </View>
              <Text style={styles.featureText}>{feature.name}</Text>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location & Contact</Text>
        <TouchableOpacity style={styles.contactItem} onPress={handleDirectionsPress}>
          <View style={styles.contactIconContainer}>
            <Ionicons name="location" size={20} color={colors.primary} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Address</Text>
            <Text style={styles.contactText}>{restaurant?.address || '123 Main St, City, State'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.contactItem} onPress={handleCallPress}>
          <View style={styles.contactIconContainer}>
            <Ionicons name="call" size={20} color={colors.primary} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Phone</Text>
            <Text style={styles.contactText}>{restaurant?.phone || '(123) 456-7890'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.gray} />
        </TouchableOpacity>
        
        <View style={styles.contactItem}>
          <View style={styles.contactIconContainer}>
            <Ionicons name="time" size={20} color={colors.primary} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Hours Today</Text>
            <Text style={styles.contactText}>{restaurant?.hours || '11:00 AM - 10:00 PM'}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderMenuTab = () => (
    <View style={styles.tabContent}>
      {menu.length > 0 ? (
        menu.map((category, index) => (
          <View key={index} style={styles.menuCategory}>
            <Text style={styles.menuCategoryTitle}>{category.name}</Text>
            {category.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.menuItem}>
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
                <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="restaurant-outline" size={60} color={colors.lightGray} />
          <Text style={styles.emptyStateText}>Menu not available</Text>
          <Text style={styles.emptyStateSubtext}>Menu details are currently unavailable. Please contact the restaurant for more information.</Text>
        </View>
      )}
    </View>
  );

  const renderReviewsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.reviewSummary}>
        <View style={styles.ratingCircle}>
          <Text style={styles.ratingText}>{restaurant?.rating?.toFixed(1) || '4.5'}</Text>
        </View>
        <View style={styles.ratingDetails}>
          <Text style={styles.ratingTitle}>Overall Rating</Text>
          <View style={styles.starsContainer}>
            {Array.from({ length: 5 }).map((_, i) => (
              <FontAwesome
                key={i}
                name={i < Math.floor(restaurant?.rating || 4.5) ? "star" : (i < restaurant?.rating || 4.5 ? "star-half-o" : "star-o")}
                size={16}
                color={colors.yellow}
                style={{ marginRight: 2 }}
              />
            ))}
          </View>
          <Text style={styles.reviewCount}>
            {restaurant?.numReviews || '120'} reviews
          </Text>
        </View>
      </View>

      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <View key={index} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewer}>
                <View style={styles.reviewerAvatar}>
                  <Text style={styles.reviewerInitial}>
                    {review.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={styles.reviewerName}>{review.name}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              </View>
              <View style={styles.reviewRating}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <FontAwesome
                    key={i}
                    name={i < review.rating ? "star" : "star-o"}
                    size={14}
                    color={colors.yellow}
                    style={{ marginLeft: 2 }}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.reviewText}>{review.text}</Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubble-ellipses-outline" size={60} color={colors.lightGray} />
          <Text style={styles.emptyStateText}>No reviews yet</Text>
          <Text style={styles.emptyStateSubtext}>Be the first to review this restaurant after your event!</Text>
        </View>
      )}
    </View>
  );

  const renderBottomBar = () => (
    <View style={styles.bottomBar}>
      <View style={styles.partySizeContainer}>
        <TouchableOpacity
          style={styles.partySizeButton}
          onPress={decrementPartySize}
          disabled={partySize <= 1}
        >
          <Ionicons
            name="remove"
            size={16}
            color={partySize <= 1 ? colors.lightGray : colors.dark}
          />
        </TouchableOpacity>
        <View style={styles.partySizeValue}>
          <Text style={styles.partySizeText}>{partySize}</Text>
          <Text style={styles.partySizeLabel}>People</Text>
        </View>
        <TouchableOpacity
          style={styles.partySizeButton}
          onPress={incrementPartySize}
          disabled={partySize >= 50}
        >
          <Ionicons
            name="add"
            size={16}
            color={partySize >= 50 ? colors.lightGray : colors.dark}
          />
        </TouchableOpacity>
      </View>
      <Button
        title="Start Planning"
        onPress={handleStartPlanning}
        style={styles.planButton}
      />
    </View>
  );

  if (loading && !restaurant) {
    return <Loading visible={true} text="Loading restaurant details..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {renderHeader()}
      
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={styles.contentContainer}>
          <View style={styles.restaurantInfoRow}>
            <View>
              <Text style={styles.restaurantName}>{restaurant?.name || name}</Text>
              <Text style={styles.cuisineText}>{restaurant?.cuisine || 'Fine Dining'}</Text>
            </View>
            {renderPriceRange()}
          </View>
          
          {renderTabs()}
          
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'menu' && renderMenuTab()}
          {activeTab === 'reviews' && renderReviewsTab()}
        </View>
      </Animated.ScrollView>
      
      {renderBottomBar()}
    </View>
  );
};

const defaultFeatures = [
  { name: 'Private Room', icon: 'key' },
  { name: 'Audio System', icon: 'musical-notes' },
  { name: 'Wheelchair Access', icon: 'accessibility' },
  { name: 'Free WiFi', icon: 'wifi' },
  { name: 'Outdoor Seating', icon: 'umbrella' },
  { name: 'Parking Available', icon: 'car' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: HEADER_MAX_HEIGHT,
    paddingBottom: 80,
  },
  contentContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primary,
    overflow: 'hidden',
    zIndex: 1,
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  headerContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  headerInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  headerInfoText: {
    fontSize: 14,
    color: colors.white,
    marginLeft: 4,
  },
  headerBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 44,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBarTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerRightButtons: {
    flexDirection: 'row',
  },
  restaurantInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  cuisineText: {
    fontSize: 14,
    color: colors.gray,
  },
  priceRangeContainer: {
    flexDirection: 'row',
  },
  dollarSign: {
    fontSize: 16,
    color: colors.lightGray,
    marginLeft: 2,
  },
  activeDollarSign: {
    color: colors.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  tabContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 22,
  },
  galleryContainer: {
    paddingBottom: 8,
  },
  galleryItem: {
    width: 140,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  eventCard: {
    marginBottom: 24,
  },
  eventCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 16,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.dark,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 2,
  },
  contactText: {
    fontSize: 14,
    color: colors.dark,
    fontWeight: '500',
  },
  menuCategory: {
    marginBottom: 24,
  },
  menuCategoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightGray,
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 13,
    color: colors.gray,
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  reviewSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  ratingCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  ratingDetails: {
    flex: 1,
  },
  ratingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.gray,
  },
  reviewItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.veryLightGray,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  reviewerInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.gray,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  partySizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgLight,
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  partySizeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  partySizeValue: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  partySizeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  partySizeLabel: {
    fontSize: 12,
    color: colors.gray,
  },
  planButton: {
    flex: 1,
  },
});

export default RestaurantDetailScreen;
