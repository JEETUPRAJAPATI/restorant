import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getRestaurants = async (latitude, longitude, filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/restaurants`, {
      params: {
        latitude,
        longitude,
        ...filters,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch restaurants');
  }
};

export const getRestaurantById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/restaurants/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch restaurant details');
  }
};

export const getRestaurantMenu = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/restaurants/${id}/menu`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch restaurant menu');
  }
};

export const getRestaurantReviews = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/restaurants/${id}/reviews`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch restaurant reviews');
  }
};

export const getRestaurantAvailability = async (id, date, partySize) => {
  try {
    const response = await axios.get(`${API_URL}/restaurants/${id}/availability`, {
      params: {
        date,
        partySize,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch restaurant availability');
  }
};
