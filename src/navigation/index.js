import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { navigationTheme } from '../constants/theme';

// Auth Screens
import GetStartedScreen from '../screens/GetStartedScreen';
import AuthScreen from '../screens/AuthScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';

// Main App Screens
import HomeScreen from '../screens/HomeScreen';
import RestaurantsScreen from '../screens/RestaurantsScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import PlattersScreen from '../screens/PlattersScreen';
import CustomPlattersScreen from '../screens/CustomPlattersScreen';
import AddonsScreen from '../screens/AddonsScreen';
import EventSummaryScreen from '../screens/EventSummaryScreen';

// Context
import { AuthContext } from '../store/authContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Authentication Navigator
const AuthNavigator = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      animation: 'slide_from_right'
    }}
  >
    <Stack.Screen name="GetStarted" component={GetStartedScreen} />
    <Stack.Screen name="Auth" component={AuthScreen} />
    <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.gray,
      tabBarStyle: {
        height: 60,
        paddingBottom: 10,
        paddingTop: 5,
      },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Explore') {
          iconName = focused ? 'search' : 'search-outline';
        } else if (route.name === 'Bookings') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Explore" component={RestaurantsScreen} />
    <Tab.Screen 
      name="Bookings" 
      component={BookingsNavigator} 
      options={{ headerShown: false }}
    />
    <Tab.Screen name="Profile" component={ProfileNavigator} />
  </Tab.Navigator>
);

// Bookings Stack Navigator (nested in Tab)
const BookingsStack = createNativeStackNavigator();
const BookingsNavigator = () => (
  <BookingsStack.Navigator
    screenOptions={{
      headerShown: true,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
      },
      headerTintColor: colors.primary,
    }}
  >
    <BookingsStack.Screen 
      name="YourBookings" 
      component={HomeScreen} 
      options={{
        title: 'Your Bookings',
      }}
    />
  </BookingsStack.Navigator>
);

// Profile Stack Navigator (nested in Tab)
const ProfileStack = createNativeStackNavigator();
const ProfileNavigator = () => (
  <ProfileStack.Navigator
    screenOptions={{
      headerShown: true,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
      },
      headerTintColor: colors.primary,
    }}
  >
    <ProfileStack.Screen 
      name="YourProfile" 
      component={HomeScreen} 
      options={{
        title: 'Your Profile',
      }}
    />
  </ProfileStack.Navigator>
);

// Main App Stack
const AppStack = createNativeStackNavigator();
const AppNavigator = () => (
  <AppStack.Navigator
    screenOptions={{
      headerShown: true,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
      },
      headerTintColor: colors.primary,
      animation: 'slide_from_right',
    }}
  >
    <AppStack.Screen 
      name="MainTabs" 
      component={TabNavigator} 
      options={{ headerShown: false }}
    />
    <AppStack.Screen 
      name="RestaurantDetail" 
      component={RestaurantDetailScreen}
      options={({ route }) => ({ 
        title: route.params?.name || 'Restaurant Details',
      })}
    />
    <AppStack.Screen 
      name="Platters" 
      component={PlattersScreen}
      options={{ title: 'Select Platters' }}
    />
    <AppStack.Screen 
      name="CustomPlatter" 
      component={CustomPlattersScreen}
      options={{ title: 'Customize Your Platter' }}
    />
    <AppStack.Screen 
      name="Addons" 
      component={AddonsScreen}
      options={{ title: 'Add Extras' }}
    />
    <AppStack.Screen 
      name="EventSummary" 
      component={EventSummaryScreen}
      options={{ title: 'Event Summary' }}
    />
  </AppStack.Navigator>
);

const Navigation = () => {
  const { token } = useContext(AuthContext);

  return (
    <NavigationContainer theme={navigationTheme}>
      {token ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default Navigation;
