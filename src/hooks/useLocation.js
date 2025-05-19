import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

const useLocation = (autoFetch = true) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);

  useEffect(() => {
    if (autoFetch) {
      getLocation();
    }
  }, [autoFetch]);

  const requestPermission = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status !== 'granted') {
        setError('Permission to access location was denied');
        
        Alert.alert(
          'Location Permission Required',
          'This app needs access to your location to find restaurants near you. Please enable location permissions in your settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Location.openSettings() }
          ]
        );
        
        return false;
      }

      return true;
    } catch (err) {
      setError(err.message || 'Failed to request location permission');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check and request permission if not already granted
      if (!permissionStatus || permissionStatus !== 'granted') {
        const hasPermission = await requestPermission();
        if (!hasPermission) return;
      }

      // Get current position
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
      });

      // Get address from coordinates
      await getAddressFromCoords(
        locationResult.coords.latitude,
        locationResult.coords.longitude
      );

      return {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
      };
    } catch (err) {
      setError(err.message || 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressResponse.length > 0) {
        const addressData = addressResponse[0];
        setAddress(addressData);

        return addressData;
      }

      return null;
    } catch (err) {
      setError(err.message || 'Failed to get address');
      return null;
    }
  };

  const formatAddressForDisplay = () => {
    if (!address) return 'Unknown Location';

    const { city, region, street, streetNumber, postalCode } = address;
    let formattedAddress = '';

    if (street) {
      formattedAddress += streetNumber ? `${streetNumber} ${street}, ` : `${street}, `;
    }

    if (city) {
      formattedAddress += `${city}`;
      if (region) formattedAddress += `, ${region}`;
    } else if (region) {
      formattedAddress += region;
    }

    if (postalCode) {
      formattedAddress += ` ${postalCode}`;
    }

    return formattedAddress || 'Unknown Location';
  };

  return {
    location,
    address,
    loading,
    error,
    permissionStatus,
    requestPermission,
    getLocation,
    getAddressFromCoords,
    formatAddressForDisplay,
  };
};

export default useLocation;
