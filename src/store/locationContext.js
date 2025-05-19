import React, { createContext, useState, useEffect } from 'react';
import useLocation from '../hooks/useLocation';

export const LocationContext = createContext({
  location: null,
  address: null,
  loading: false,
  error: null,
  getLocation: () => {},
  formatAddressForDisplay: () => 'Unknown Location',
});

export const LocationProvider = ({ children }) => {
  const {
    location,
    address,
    loading,
    error,
    getLocation,
    formatAddressForDisplay,
  } = useLocation(true); // Auto fetch on mount

  const value = {
    location,
    address,
    loading,
    error,
    getLocation,
    formatAddressForDisplay,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
