import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  Platform,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import RestaurantCard from '../components/RestaurantCard';
import FilterModal from '../components/FilterModal';
import Loading from '../components/Loading';
import { LocationContext } from '../store/locationContext';
import { RestaurantContext } from '../store/restaurantContext';

const RestaurantsScreen = ({ navigation, route }) => {
  const { partyType } = route.params || {};
  const { location, formatAddressForDisplay, getLocation } = useContext(LocationContext);
  const { restaurants, loadRestaurants, toggleFavorite, loading } = useContext(RestaurantContext);
  
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    partyType: partyType || null,
    groupSize: 4,
    priceRange: 2,
    distance: 10,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 60;
  const headerAnimation = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (location) {
      loadData();
    } else {
      getLocation();
    }
  }, [location]);

  useEffect(() => {
    if (partyType && partyType !== filters.partyType) {
      setFilters(prev => ({ ...prev, partyType }));
    }
  }, [partyType]);

  useEffect(() => {
    filterRestaurants();
  }, [restaurants, searchText, filters]);

  const loadData = async () => {
    if (location) {
      await loadRestaurants(location, filters);
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

  const filterRestaurants = () => {
    if (!restaurants) {
      setFilteredData([]);
      return;
    }

    let filtered = [...restaurants];

    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.cuisine.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters (Note: most filtering happens server-side, this is just for UI responsiveness)
    if (filters.priceRange) {
      filtered = filtered.filter(item => item.priceRange <= filters.priceRange);
    }

    setFilteredData(filtered);
  };

  const handleApplyFilters = async (newFilters) => {
    setFilters(newFilters);
    if (location) {
      await loadRestaurants(location, newFilters);
    }
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  const renderItem = ({ item }) => (
    <RestaurantCard
      restaurant={item}
      onPress={() => navigation.navigate('RestaurantDetail', item)}
      onToggleFavorite={toggleFavorite}
    />
  );

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        { transform: [{ translateY: headerAnimation }] },
      ]}
    >
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants, cuisines..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={colors.gray}
        />
        {searchText ? (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={colors.gray} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setFilterModalVisible(true)}
      >
        <Ionicons name="options-outline" size={22} color={colors.white} />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFiltersApplied = () => {
    if (!filters.partyType && filters.priceRange === 2 && filters.distance === 10) {
      return null;
    }

    return (
      <View style={styles.filterTags}>
        {filters.partyType && (
          <View style={styles.filterTag}>
            <Text style={styles.filterTagText}>
              {eventTypes.find(type => type.id === filters.partyType)?.name || 'Event'}
            </Text>
            <TouchableOpacity
              onPress={() => setFilters(prev => ({ ...prev, partyType: null }))}
            >
              <Ionicons name="close" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
        
        {filters.priceRange !== 2 && (
          <View style={styles.filterTag}>
            <Text style={styles.filterTagText}>
              {'$'.repeat(filters.priceRange)}
            </Text>
            <TouchableOpacity
              onPress={() => setFilters(prev => ({ ...prev, priceRange: 2 }))}
            >
              <Ionicons name="close" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
        
        {filters.distance !== 10 && (
          <View style={styles.filterTag}>
            <Text style={styles.filterTagText}>
              {`${filters.distance} km`}
            </Text>
            <TouchableOpacity
              onPress={() => setFilters(prev => ({ ...prev, distance: 10 }))}
            >
              <Ionicons name="close" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
        
        <TouchableOpacity
          style={styles.clearFilters}
          onPress={() => setFilters({
            partyType: null,
            groupSize: 4,
            priceRange: 2,
            distance: 10,
          })}
        >
          <Text style={styles.clearFiltersText}>Clear All</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="restaurant-outline" size={60} color={colors.lightGray} />
      <Text style={styles.emptyTitle}>No Restaurants Found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your filters or search criteria
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      {renderHeader()}
      
      <Loading visible={loading && !refreshing} text="Searching restaurants..." />
      
      <Animated.FlatList
        contentContainerStyle={styles.listContainer}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color={colors.primary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {location ? formatAddressForDisplay() : 'Set your location'}
              </Text>
              <TouchableOpacity onPress={getLocation}>
                <Ionicons name="navigate" size={16} color={colors.gray} />
              </TouchableOpacity>
            </View>
            
            {renderFiltersApplied()}
            
            <Text style={styles.resultsText}>
              {filteredData.length} {filteredData.length === 1 ? 'restaurant' : 'restaurants'} found
            </Text>
          </View>
        }
        ListEmptyComponent={renderEmpty()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
      
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        initialFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </View>
  );
};

const eventTypes = [
  { id: 1, name: 'Birthday' },
  { id: 2, name: 'Anniversary' },
  { id: 3, name: 'Corporate' },
  { id: 4, name: 'Wedding' },
  { id: 5, name: 'Casual Gathering' },
  { id: 6, name: 'Engagement' },
  { id: 7, name: 'Bachelor/Bachelorette' },
  { id: 8, name: 'Holiday' },
  { id: 9, name: 'Graduation' },
  { id: 10, name: 'Baby Shower' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: headerHeight,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgLight,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: colors.dark,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  listContainer: {
    padding: 16,
    paddingTop: headerHeight + 16,
  },
  listHeader: {
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: colors.dark,
    marginHorizontal: 8,
  },
  filterTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    alignItems: 'center',
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightPrimary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  filterTagText: {
    fontSize: 12,
    color: colors.primary,
    marginRight: 4,
  },
  clearFilters: {
    paddingVertical: 6,
  },
  clearFiltersText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  resultsText: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
});

export default RestaurantsScreen;
