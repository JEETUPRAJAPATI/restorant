const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Calculate distance between two coordinates in kilometers
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

/**
 * Convert degrees to radians
 * @param {number} deg - Degrees
 * @returns {number} Radians
 */
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

/**
 * Get geocode from address using Google Maps API
 * @param {string} address - Address to geocode
 * @returns {Promise<object>} Geocode result with lat and lng
 */
const getGeoLocation = async (address) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not found');
    }
    
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    if (response.data.status !== 'OK') {
      throw new Error(`Geocoding error: ${response.data.status}`);
    }
    
    const { lat, lng } = response.data.results[0].geometry.location;
    
    return { latitude: lat, longitude: lng };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

/**
 * Get distance and duration between two points using Google Maps Distance Matrix API
 * @param {number} originLat - Origin latitude
 * @param {number} originLng - Origin longitude
 * @param {number} destLat - Destination latitude
 * @param {number} destLng - Destination longitude
 * @returns {Promise<object>} Distance and duration information
 */
const getDistanceMatrix = async (originLat, originLng, destLat, destLng) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      // Fallback to simple distance calculation if API key not available
      const distance = calculateDistance(originLat, originLng, destLat, destLng);
      return {
        distance: {
          text: `${distance.toFixed(1)} km`,
          value: Math.round(distance * 1000) // in meters
        },
        duration: {
          text: 'Not available',
          value: 0
        }
      };
    }
    
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    if (
      response.data.status !== 'OK' ||
      response.data.rows[0].elements[0].status !== 'OK'
    ) {
      throw new Error(`Distance Matrix error: ${response.data.status}`);
    }
    
    return {
      distance: response.data.rows[0].elements[0].distance,
      duration: response.data.rows[0].elements[0].duration
    };
  } catch (error) {
    console.error('Distance Matrix error:', error);
    
    // Fallback to simple distance calculation
    const distance = calculateDistance(originLat, originLng, destLat, destLng);
    return {
      distance: {
        text: `${distance.toFixed(1)} km`,
        value: Math.round(distance * 1000) // in meters
      },
      duration: {
        text: 'Not available',
        value: 0
      }
    };
  }
};

module.exports = {
  calculateDistance,
  getGeoLocation,
  getDistanceMatrix
};
