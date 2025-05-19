import React, { createContext, useState, useEffect, useContext } from 'react';
import { getRestaurants } from '../api/restaurants';
import { LocationContext } from './locationContext';
import { getRandomImage } from '../constants/images';

export const RestaurantContext = createContext({
  restaurants: [],
  nearbyRestaurants: [],
  popularRestaurants: [],
  loading: false,
  error: null,
  loadRestaurants: () => {},
  loadNearbyRestaurants: () => {},
  loadPopularRestaurants: () => {},
  toggleFavorite: () => {},
});

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [popularRestaurants, setPopularRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { location } = useContext(LocationContext);

  // Mock data for development since we don't have a real API integration yet
  const generateMockRestaurants = (count = 10, location, filters = {}) => {
    const cuisines = ['Italian', 'American', 'Chinese', 'Indian', 'Japanese', 'Thai', 'Mexican', 'French'];
    const names = [
      'The Rustic Spoon', 'Bella Vista', 'Golden Dragon', 'Spice Garden', 
      'Ocean Blue', 'The Hungry Chef', 'Casa Blanca', 'Urban Plate',
      'Fire & Ice', 'Green Valley', 'The Grand Table', 'Sapphire Lounge'
    ];
    
    return Array(count).fill(0).map((_, i) => ({
      id: i + 1,
      name: names[i % names.length],
      cuisine: cuisines[Math.floor(Math.random() * cuisines.length)],
      image: getRandomImage('restaurantInteriors'),
      rating: 3.5 + Math.random() * 1.5,
      numReviews: Math.floor(Math.random() * 200) + 50,
      priceRange: Math.floor(Math.random() * 3) + 1,
      distance: Math.round((Math.random() * 9.9 + 0.1) * 10) / 10,
      isFavorite: Math.random() > 0.7,
      address: '123 Main St, City',
      features: [
        { name: 'Private Room', icon: 'key' },
        { name: 'Audio System', icon: 'musical-notes' },
        { name: 'Wheelchair Access', icon: 'accessibility' },
        { name: 'Free WiFi', icon: 'wifi' },
        { name: 'Outdoor Seating', icon: 'umbrella' },
        { name: 'Parking Available', icon: 'car' },
      ],
      description: 'A wonderful restaurant with a perfect atmosphere for events and gatherings. Our space can accommodate groups of various sizes and our staff is dedicated to making your event special.',
      location: location ? {
        latitude: location.latitude + (Math.random() - 0.5) * 0.01,
        longitude: location.longitude + (Math.random() - 0.5) * 0.01,
      } : null,
    }));
  };

  const loadRestaurants = async (location, filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      if (!location) {
        throw new Error('Location not available');
      }

      // In a real app, we would make an API call here
      // const response = await getRestaurants(location.latitude, location.longitude, filters);
      // setRestaurants(response);

      // For development, let's use mock data
      const mockData = generateMockRestaurants(15, location, filters);
      
      // Apply filters
      let filteredData = [...mockData];
      
      if (filters.partyType) {
        // Filter restaurants based on party type
        // In a real app, this would be part of the API query
        filteredData = filteredData.filter(r => r.id % (filters.partyType + 1) !== 0);
      }
      
      if (filters.priceRange) {
        filteredData = filteredData.filter(r => r.priceRange <= filters.priceRange);
      }
      
      if (filters.distance) {
        filteredData = filteredData.filter(r => r.distance <= filters.distance);
      }
      
      setRestaurants(filteredData);
      
      return filteredData;
    } catch (err) {
      setError(err.message || 'Failed to load restaurants');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyRestaurants = async (location) => {
    try {
      if (!location) return;
      
      const restaurantsData = await loadRestaurants(location);
      // Sort by distance for nearby restaurants
      const nearbyData = [...restaurantsData]
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);
      
      setNearbyRestaurants(nearbyData);
      return nearbyData;
    } catch (err) {
      console.error('Error loading nearby restaurants', err);
      return [];
    }
  };

  const loadPopularRestaurants = async (location) => {
    try {
      if (!location) return;
      
      const restaurantsData = await loadRestaurants(location);
      // Sort by rating for popular restaurants
      const popularData = [...restaurantsData]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
      
      setPopularRestaurants(popularData);
      return popularData;
    } catch (err) {
      console.error('Error loading popular restaurants', err);
      return [];
    }
  };

  const toggleFavorite = (restaurantId) => {
    setRestaurants(prev => 
      prev.map(restaurant => 
        restaurant.id === restaurantId
          ? { ...restaurant, isFavorite: !restaurant.isFavorite }
          : restaurant
      )
    );
    
    setNearbyRestaurants(prev => 
      prev.map(restaurant => 
        restaurant.id === restaurantId
          ? { ...restaurant, isFavorite: !restaurant.isFavorite }
          : restaurant
      )
    );
    
    setPopularRestaurants(prev => 
      prev.map(restaurant => 
        restaurant.id === restaurantId
          ? { ...restaurant, isFavorite: !restaurant.isFavorite }
          : restaurant
      )
    );
  };

  const value = {
    restaurants,
    nearbyRestaurants,
    popularRestaurants,
    loading,
    error,
    loadRestaurants,
    loadNearbyRestaurants,
    loadPopularRestaurants,
    toggleFavorite,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};
