import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  Animated,
  RefreshControl,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { getRandomImage } from '../constants/images';
import Card from '../components/Card';
import RestaurantCard from '../components/RestaurantCard';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { AuthContext } from '../store/authContext';
import { LocationContext } from '../store/locationContext';
import { RestaurantContext } from '../store/restaurantContext';
import { formatCurrency } from '../utils/helpers';

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { location, formatAddressForDisplay, getLocation } = useContext(LocationContext);
  const { 
    nearbyRestaurants, 
    popularRestaurants, 
    loadNearbyRestaurants, 
    loadPopularRestaurants, 
    toggleFavorite, 
    loading 
  } = useContext(RestaurantContext);

  const [refreshing, setRefreshing] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(!location);
  
  const fadeAnim = new Animated.Value(0);
  const translateY = new Animated.Value(30);

  useEffect(() => {
    if (location) {
      loadData();
      setShowLocationPrompt(false);
    }
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [location]);

  const loadData = async () => {
    if (location) {
      Promise.all([
        loadNearbyRestaurants(location),
        loadPopularRestaurants(location)
      ]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await getLocation();
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleEnableLocation = async () => {
    const locationData = await getLocation();
    if (locationData) {
      setShowLocationPrompt(false);
    }
  };

  const handleExploreMore = () => {
    navigation.navigate('Explore');
  };

  const renderEventTypeItem = ({ item }) => (
    <TouchableOpacity style={styles.eventTypeItem} onPress={() => navigation.navigate('Explore', { partyType: item.id })}>
      <View style={[styles.eventTypeIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color={colors.white} />
      </View>
      <Text style={styles.eventTypeName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRestaurantItem = ({ item }) => (
    <RestaurantCard 
      restaurant={item} 
      onPress={() => navigation.navigate('RestaurantDetail', item)} 
      onToggleFavorite={toggleFavorite}
    />
  );

  if (loading && !refreshing && !nearbyRestaurants.length) {
    return <Loading visible={true} text="Finding restaurants near you..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateY }],
            },
          ]}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hello, {user?.name || 'there'} 👋</Text>
              <TouchableOpacity style={styles.locationContainer} onPress={getLocation}>
                <Ionicons name="location" size={16} color={colors.primary} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {location ? formatAddressForDisplay() : 'Set your location'}
                </Text>
                <Ionicons name="chevron-down" size={16} color={colors.gray} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="notifications-outline" size={24} color={colors.dark} />
            </TouchableOpacity>
          </View>
          
          {showLocationPrompt && (
            <Card style={styles.locationPrompt}>
              <View style={styles.locationPromptContent}>
                <View style={styles.locationIcon}>
                  <Ionicons name="navigate" size={24} color={colors.white} />
                </View>
                <View style={styles.locationPromptText}>
                  <Text style={styles.locationPromptTitle}>Enable location</Text>
                  <Text style={styles.locationPromptSubtitle}>
                    We need your location to show restaurants near you
                  </Text>
                </View>
              </View>
              <Button
                title="Enable Location"
                onPress={handleEnableLocation}
                type="primary"
                style={styles.locationButton}
              />
            </Card>
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateY }],
            },
          ]}
        >
          <Image
            source={{ uri: getRandomImage('celebrationEvents') }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Plan Your Perfect Event</Text>
            <Text style={styles.heroSubtitle}>
              Find restaurants and create custom menus for your celebration
            </Text>
            <Button
              title="Start Planning"
              onPress={() => navigation.navigate('Explore')}
              style={styles.heroButton}
            />
          </View>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Types</Text>
          <FlatList
            data={eventTypes}
            renderItem={renderEventTypeItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventTypesList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Restaurants</Text>
            <TouchableOpacity onPress={handleExploreMore}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {nearbyRestaurants.length > 0 ? (
            <FlatList
              data={nearbyRestaurants}
              renderItem={renderRestaurantItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.restaurantsList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={40} color={colors.gray} />
              <Text style={styles.emptyStateText}>No restaurants found nearby</Text>
              <Text style={styles.emptyStateSubtext}>Try expanding your search area</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular for Events</Text>
            <TouchableOpacity onPress={handleExploreMore}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {popularRestaurants.length > 0 ? (
            <FlatList
              data={popularRestaurants}
              renderItem={renderRestaurantItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.restaurantsList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="star-outline" size={40} color={colors.gray} />
              <Text style={styles.emptyStateText}>No popular restaurants available</Text>
              <Text style={styles.emptyStateSubtext}>Check back soon for recommendations</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const eventTypes = [
  { id: 1, name: 'Birthday', icon: 'gift-outline', color: colors.primary },
  { id: 2, name: 'Anniversary', icon: 'heart-outline', color: colors.error },
  { id: 3, name: 'Corporate', icon: 'briefcase-outline', color: colors.info },
  { id: 4, name: 'Wedding', icon: 'people-outline', color: colors.teal },
  { id: 5, name: 'Casual', icon: 'beer-outline', color: colors.orange },
  { id: 6, name: 'Engagement', icon: 'diamond-outline', color: colors.secondary },
  { id: 7, name: 'Graduation', icon: 'school-outline', color: colors.success },
  { id: 8, name: 'Holiday', icon: 'calendar-outline', color: colors.yellow },
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
    paddingBottom: 20,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: colors.gray,
    marginHorizontal: 4,
    maxWidth: 200,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationPrompt: {
    marginTop: 10,
    marginBottom: 5,
  },
  locationPromptContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationPromptText: {
    flex: 1,
  },
  locationPromptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 2,
  },
  locationPromptSubtitle: {
    fontSize: 14,
    color: colors.gray,
  },
  locationButton: {
    marginTop: 5,
  },
  heroSection: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    justifyContent: 'flex-end',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 12,
    opacity: 0.9,
  },
  heroButton: {
    alignSelf: 'flex-start',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: '500',
  },
  eventTypesList: {
    paddingHorizontal: 20,
  },
  eventTypeItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  eventTypeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTypeName: {
    fontSize: 13,
    color: colors.dark,
    textAlign: 'center',
  },
  restaurantsList: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default HomeScreen;
