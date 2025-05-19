import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getPlattersByRestaurant = async (restaurantId) => {
  try {
    const response = await axios.get(`${API_URL}/restaurants/${restaurantId}/platters`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch platters');
  }
};

export const getRecommendedPlatters = async (
  restaurantId,
  budget,
  partySize,
  preferences = []
) => {
  try {
    const response = await axios.get(
      `${API_URL}/restaurants/${restaurantId}/recommendations`,
      {
        params: {
          budget,
          partySize,
          preferences: preferences.join(','),
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error('Failed to fetch recommended platters');
  }
};

export const getPlatterById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/platters/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch platter details');
  }
};

export const getAddons = async (restaurantId, platterId) => {
  try {
    const response = await axios.get(`${API_URL}/restaurants/${restaurantId}/addons`, {
      params: {
        platterId,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch addons');
  }
};

export const createCustomPlatter = async (restaurantId, plattertData) => {
  try {
    const response = await axios.post(
      `${API_URL}/restaurants/${restaurantId}/platters/custom`,
      plattertData
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to create custom platter');
  }
};
