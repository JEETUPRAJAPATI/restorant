import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SectionList,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import AddonsCard from '../components/AddonsCard';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { getAddons } from '../api/platters';
import { formatCurrency } from '../utils/helpers';

const AddonsScreen = ({ route, navigation }) => {
  const { 
    restaurantId, 
    restaurantName, 
    selectedPlatters = [], 
    partySize = 4,
    totalCost = 0
  } = route.params;
  
  const [addons, setAddons] = useState([]);
  const [addonCategories, setAddonCategories] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addonTotalCost, setAddonTotalCost] = useState(0);
  
  useEffect(() => {
    fetchAddons();
  }, []);
  
  useEffect(() => {
    calculateAddonTotal();
  }, [selectedAddons]);
  
  const fetchAddons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const platterIds = selectedPlatters.map(platter => platter.id);
      const firstPlatterId = platterIds.length > 0 ? platterIds[0] : null;
      
      if (!firstPlatterId) {
        setError('No platters selected.');
        return;
      }
      
      const addonsData = await getAddons(restaurantId, firstPlatterId);
      
      if (addonsData && addonsData.length > 0) {
        setAddons(addonsData);
        
        // Group addons by category
        const categories = addonsData.reduce((acc, addon) => {
          const category = addon.category || 'Other';
          
          if (!acc[category]) {
            acc[category] = [];
          }
          
          acc[category].push(addon);
          return acc;
        }, {});
        
        // Convert to format for SectionList
        const sectionData = Object.keys(categories).map(title => ({
          title,
          data: categories[title],
        }));
        
        setAddonCategories(sectionData);
      }
      
    } catch (err) {
      setError('Failed to load add-ons. Please try again.');
      console.error('Error fetching add-ons:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const calculateAddonTotal = () => {
    let total = 0;
    
    Object.entries(selectedAddons).forEach(([addonId, data]) => {
      const addon = addons.find(a => a.id.toString() === addonId);
      if (addon) {
        total += addon.price * data.quantity;
      }
    });
    
    setAddonTotalCost(total);
  };
  
  const handleSelectAddon = (addonId) => {
    setSelectedAddons(prev => {
      const newState = { ...prev };
      
      if (newState[addonId]) {
        delete newState[addonId];
      } else {
        newState[addonId] = { quantity: 1 };
      }
      
      return newState;
    });
  };
  
  const handleIncrementAddon = (addonId) => {
    setSelectedAddons(prev => {
      if (!prev[addonId]) return prev;
      
      return {
        ...prev,
        [addonId]: {
          ...prev[addonId],
          quantity: (prev[addonId].quantity || 1) + 1,
        },
      };
    });
  };
  
  const handleDecrementAddon = (addonId) => {
    setSelectedAddons(prev => {
      if (!prev[addonId]) return prev;
      
      const currentQty = prev[addonId].quantity || 1;
      
      if (currentQty <= 1) {
        const newState = { ...prev };
        delete newState[addonId];
        return newState;
      }
      
      return {
        ...prev,
        [addonId]: {
          ...prev[addonId],
          quantity: currentQty - 1,
        },
      };
    });
  };
  
  const handleContinue = () => {
    const selectedAddonItems = Object.entries(selectedAddons).map(([addonId, data]) => {
      const addon = addons.find(a => a.id.toString() === addonId);
      return {
        ...addon,
        quantity: data.quantity,
      };
    });
    
    navigation.navigate('EventSummary', {
      restaurantId,
      restaurantName,
      selectedPlatters,
      selectedAddons: selectedAddonItems,
      partySize,
      totalCost: totalCost + addonTotalCost,
    });
  };
  
  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
  
  const renderAddonItem = ({ item }) => {
    const isSelected = selectedAddons[item.id] !== undefined;
    const quantity = isSelected ? selectedAddons[item.id].quantity : 0;
    
    return (
      <AddonsCard
        addon={item}
        onSelect={handleSelectAddon}
        isSelected={isSelected}
        quantity={quantity}
        onIncrement={handleIncrementAddon}
        onDecrement={handleDecrementAddon}
      />
    );
  };
  
  if (loading) {
    return <Loading visible={true} text="Loading add-ons..." />;
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryTitle}>Your Selections</Text>
          <Text style={styles.summaryInfo}>
            {selectedPlatters.length} platter{selectedPlatters.length !== 1 ? 's' : ''} for {partySize} people
          </Text>
        </View>
        <View style={styles.summaryAmount}>
          <Text style={styles.baseAmountLabel}>Base amount</Text>
          <Text style={styles.baseAmount}>{formatCurrency(totalCost)}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.pageTitle}>Choose Optional Add-ons</Text>
        <Text style={styles.pageSubtitle}>
          Enhance your event with these add-ons
        </Text>
        
        {addonCategories.length > 0 ? (
          <SectionList
            sections={addonCategories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderAddonItem}
            renderSectionHeader={renderSectionHeader}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={styles.addonsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="basket-outline" size={60} color={colors.lightGray} />
            <Text style={styles.emptyStateText}>No Add-ons Available</Text>
            <Text style={styles.emptyStateSubtext}>
              This restaurant doesn't have any add-ons available at the moment.
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>New Total</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(totalCost + addonTotalCost)}
          </Text>
          {addonTotalCost > 0 && (
            <Text style={styles.addonsAmount}>
              (+{formatCurrency(addonTotalCost)} add-ons)
            </Text>
          )}
        </View>
        <Button
          title="Continue"
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
  },
  summaryContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  summaryInfo: {
    fontSize: 14,
    color: colors.gray,
  },
  summaryAmount: {
    alignItems: 'flex-end',
  },
  baseAmountLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 2,
  },
  baseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 20,
  },
  addonsList: {
    paddingBottom: 100,
  },
  sectionHeader: {
    backgroundColor: colors.bgLight,
    padding: 8,
    marginVertical: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: 20,
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
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  addonsAmount: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
  },
  continueButton: {
    width: 130,
  },
});

export default AddonsScreen;
