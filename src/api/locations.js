import axios from 'axios';
import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const { latitude, longitude } = location.coords;
    return { latitude, longitude };
  } catch (error) {
    throw error;
  }
};

export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (response.length > 0) {
      return response[0];
    }

    throw new Error('No address found for the coordinates');
  } catch (error) {
    throw error;
  }
};

export const getDistanceBetween = async (originLat, originLng, destLat, destLng) => {
  try {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&key=${API_KEY}`
    );

    if (response.data.status === 'OK' && 
        response.data.rows[0].elements[0].status === 'OK') {
      return {
        distance: response.data.rows[0].elements[0].distance,
        duration: response.data.rows[0].elements[0].duration,
      };
    }
    
    throw new Error('Failed to calculate distance');
  } catch (error) {
    throw error;
  }
};
