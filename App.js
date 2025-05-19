import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './src/constants/theme';
import Navigation from './src/navigation';
import { AuthProvider } from './src/store/authContext';
import { LocationProvider } from './src/store/locationContext';
import { RestaurantProvider } from './src/store/restaurantContext';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate splash screen delay
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <LocationProvider>
            <RestaurantProvider>
              <Navigation />
              <StatusBar style="auto" />
            </RestaurantProvider>
          </LocationProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
