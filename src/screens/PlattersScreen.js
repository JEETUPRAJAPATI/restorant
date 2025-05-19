import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import PlattersCard from '../components/PlattersCard';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Card from '../components/Card';
import { getPlattersByRestaurant, getRecommendedPlatters } from '../api/platters';
import { formatCurrency } from '../utils/helpers';

const PlattersScreen = ({ route, navigation }) => {
  const { restaurantId, restaurantName, partySize = 4 } = route.params;
  
  const [platters, setPlatters] = useState([]);
  const [recommendedPlatters, setRecommendedPlatters] = useState([]);
  const [selectedPlatters, setSelectedPlatters] = useState([]);
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [preferences, setPreferences] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  
  useEffect(() => {
    fetchPlatters();
  }, []);
  
  useEffect(() => {
    const calcTotal = selectedPlatters.reduce((sum, platterId) => {
      const platter = platters.find(p => p.id === platterId);
      return sum + (platter ? platter.price : 0);
    }, 0);
    
    setTotalCost(calcTotal);
  }, [selectedPlatters, platters]);

  const fetchPlatters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const plattersData = await getPlattersByRestaurant(restaurantId);
      setPlatters(plattersData.platters || []);
      
      // Extract unique preferences from platters
      if (plattersData.platters && plattersData.platters.length > 0) {
        const allPrefs = plattersData.platters.reduce((prefs, platter) => {
          if (platter.tags && platter.tags.length > 0) {
            return [...prefs, ...platter.tags];
          }
          return prefs;
        }, []);
        
        // Remove duplicates
        const uniquePrefs = [...new Set(allPrefs)];
        setPreferences(uniquePrefs);
      }
      
    } catch (err) {
      setError('Failed to load platters. Please try again.');
      console.error('Error fetching platters:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRecommendations = async () => {
    try {
      if (!budget || isNaN(parseFloat(budget)) || parseFloat(budget) <= 0) {
        Alert.alert('Please enter a valid budget');
        return;
      }
      
      setRecommendationsLoading(true);
      
      const budgetValue = parseFloat(budget);
      const recommendations = await getRecommendedPlatters(
        restaurantId,
        budgetValue,
        partySize,
        selectedPreferences
      );
      
      setRecommendedPlatters(recommendations);
      
      // Automatically select recommended platters if user hasn't made any selections yet
      if (selectedPlatters.length === 0 && recommendations.length > 0) {
        setSelectedPlatters(recommendations.map(platter => platter.id));
      }
      
    } catch (err) {
      setError('Failed to load recommendations. Please try again.');
      console.error('Error fetching recommendations:', err);
    } finally {
      setRecommendationsLoading(false);
    }
  };
  
  const handlePlatterSelection = (platterId) => {
    setSelectedPlatters(prev => {
      if (prev.includes(platterId)) {
        return prev.filter(id => id !== platterId);
      } else {
        return [...prev, platterId];
      }
    });
  };
  
  const handlePreferenceSelect = (preference) => {
    setSelectedPreferences(prev => {
      if (prev.includes(preference)) {
        return prev.filter(p => p !== preference);
      } else {
        return [...prev, preference];
      }
    });
  };
  
  const handleCustomizePlatter = (platterId) => {
    navigation.navigate('CustomPlatter', {
      restaurantId,
      platterId,
      partySize,
    });
  };
  
  const handleContinue = () => {
    if (selectedPlatters.length === 0) {
      Alert.alert('Please select at least one platter');
      return;
    }
    
    navigation.navigate('Addons', {
      restaurantId,
      restaurantName,
      selectedPlatters: selectedPlatters.map(id => {
        const platter = platters.find(p => p.id === id);
        return platter;
      }),
      partySize,
      totalCost,
    });
  };
  
  const isPlatterWithinBudget = (platterPrice) => {
    if (!budget || isNaN(parseFloat(budget))) return true;
    
    const budgetPerPerson = parseFloat(budget);
    const costPerPerson = platterPrice / partySize;
    
    return costPerPerson <= budgetPerPerson;
  };
  
  const renderPlatterItem = ({ item }) => {
    const isSelected = selectedPlatters.includes(item.id);
    const isRecommended = recommendedPlatters.some(p => p.id === item.id);
    const isWithinBudget = isPlatterWithinBudget(item.price);
    
    return (
      <PlattersCard
        platter={{
          ...item,
          isWithinBudget,
        }}
        onPress={() => {}}
        isRecommended={isRecommended}
        selectable={true}
        isSelected={isSelected}
        onSelect={handlePlatterSelection}
        showAddCustomize={isSelected}
        onCustomize={() => handleCustomizePlatter(item.id)}
      />
    );
  };
  
  const renderPreferenceItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.preferenceTag,
        selectedPreferences.includes(item) && styles.selectedPreferenceTag,
      ]}
      onPress={() => handlePreferenceSelect(item)}
    >
      <Text
        style={[
          styles.preferenceTagText,
          selectedPreferences.includes(item) && styles.selectedPreferenceTagText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );
  
  if (loading) {
    return <Loading visible={true} text="Loading platters..." />;
  }
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.budgetCard}>
          <Text style={styles.budgetTitle}>Set Your Budget</Text>
          <Text style={styles.budgetSubtitle}>
            Enter your per-person budget to get platter recommendations
          </Text>
          
          <View style={styles.budgetInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.budgetInput}
              placeholder="Budget per person"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
            />
            <View style={styles.personContainer}>
              <Text style={styles.personText}>/ person</Text>
            </View>
          </View>
          
          <View style={styles.partyInfoContainer}>
            <Ionicons name="people" size={16} color={colors.gray} />
            <Text style={styles.partyInfoText}>Planning for {partySize} people</Text>
          </View>
          
          {preferences.length > 0 && (
            <View style={styles.preferencesContainer}>
              <Text style={styles.preferencesTitle}>Dietary Preferences</Text>
              <FlatList
                data={preferences}
                renderItem={renderPreferenceItem}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.preferencesList}
              />
            </View>
          )}
          
          <Button
            title={recommendationsLoading ? "Getting Recommendations..." : "Get Recommendations"}
            onPress={fetchRecommendations}
            disabled={recommendationsLoading || !budget}
            loading={recommendationsLoading}
          />
        </Card>
        
        {recommendedPlatters.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            {recommendedPlatters.map((platter) => (
              <PlattersCard
                key={platter.id}
                platter={{
                  ...platter,
                  isWithinBudget: true,
                }}
                onPress={() => {}}
                isRecommended={true}
                selectable={true}
                isSelected={selectedPlatters.includes(platter.id)}
                onSelect={handlePlatterSelection}
                showAddCustomize={selectedPlatters.includes(platter.id)}
                onCustomize={() => handleCustomizePlatter(platter.id)}
              />
            ))}
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Platters</Text>
          {platters.length > 0 ? (
            <FlatList
              data={platters}
              renderItem={renderPlatterItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={60} color={colors.lightGray} />
              <Text style={styles.emptyStateText}>No Platters Available</Text>
              <Text style={styles.emptyStateSubtext}>
                This restaurant doesn't have any platters available at the moment.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      {selectedPlatters.length > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalAmount}>{formatCurrency(totalCost)}</Text>
          </View>
          <Button
            title={`Continue with ${selectedPlatters.length} Platter${selectedPlatters.length > 1 ? 's' : ''}`}
            onPress={handleContinue}
            style={styles.continueButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  budgetCard: {
    marginBottom: 24,
  },
  budgetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 8,
  },
  budgetSubtitle: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 16,
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    height: 48,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 18,
    color: colors.dark,
    paddingLeft: 16,
    paddingRight: 4,
  },
  budgetInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.dark,
  },
  personContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.bgLight,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    height: '100%',
    justifyContent: 'center',
  },
  personText: {
    fontSize: 14,
    color: colors.gray,
  },
  partyInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgLight,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  partyInfoText: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.dark,
  },
  preferencesContainer: {
    marginBottom: 16,
  },
  preferencesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 8,
  },
  preferencesList: {
    paddingVertical: 4,
  },
  preferenceTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.bgLight,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedPreferenceTag: {
    backgroundColor: colors.lightPrimary,
  },
  preferenceTagText: {
    fontSize: 12,
    color: colors.gray,
  },
  selectedPreferenceTagText: {
    color: colors.primary,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  totalContainer: {
    marginRight: 16,
  },
  totalText: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  continueButton: {
    flex: 1,
  },
});

export default PlattersScreen;
