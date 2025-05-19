import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  FlatList,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { getPlatterById, createCustomPlatter } from '../api/platters';
import { getRandomImage } from '../constants/images';
import { formatCurrency } from '../utils/helpers';

const CustomPlattersScreen = ({ route, navigation }) => {
  const { restaurantId, platterId, partySize = 4 } = route.params;
  
  const [platter, setPlatter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    fetchPlatter();
  }, []);
  
  const fetchPlatter = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const platterData = await getPlatterById(platterId);
      setPlatter(platterData);
      
      // Initialize selected items if platter has items
      if (platterData && platterData.items) {
        setSelectedItems(platterData.items.map(item => ({
          ...item,
          selected: true,
          quantity: 1,
        })));
      }
      
    } catch (err) {
      setError('Failed to load platter details. Please try again.');
      console.error('Error fetching platter:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleItemToggle = (itemId) => {
    setSelectedItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, selected: !item.selected } 
          : item
      )
    );
  };
  
  const handleQuantityChange = (itemId, change) => {
    setSelectedItems(prev => 
      prev.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { 
            ...item, 
            quantity: newQuantity,
            selected: newQuantity > 0 // Deselect if quantity becomes 0
          };
        }
        return item;
      })
    );
  };
  
  const handleSave = async () => {
    try {
      if (selectedItems.filter(item => item.selected).length === 0) {
        Alert.alert('Please select at least one item for your platter');
        return;
      }
      
      setIsSubmitting(true);
      
      const customPlatterData = {
        originalPlatterId: platterId,
        name: platter.name,
        items: selectedItems
          .filter(item => item.selected)
          .map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
          })),
        servingSize: platter.servingSize,
        specialInstructions: specialInstructions.trim(),
      };
      
      const result = await createCustomPlatter(restaurantId, customPlatterData);
      
      if (result.success) {
        navigation.goBack();
        // You could also navigate directly to addons if you'd like
        // navigation.navigate('Addons', { ... });
      } else {
        Alert.alert('Error', result.message || 'Failed to save custom platter.');
      }
      
    } catch (err) {
      Alert.alert('Error', 'Failed to save your custom platter. Please try again.');
      console.error('Error saving custom platter:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getTotalPrice = () => {
    if (!platter || !selectedItems.length) return 0;
    
    return selectedItems.reduce((total, item) => {
      if (item.selected) {
        return total + (item.price * item.quantity);
      }
      return total;
    }, 0);
  };
  
  const renderItem = ({ item }) => (
    <Card style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            item.selected ? styles.toggleButtonActive : {},
          ]}
          onPress={() => handleItemToggle(item.id)}
        >
          {item.selected ? (
            <Ionicons name="checkmark" size={18} color={colors.white} />
          ) : (
            <Text style={styles.toggleButtonText}>Add</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {item.selected && (
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, -1)}
            disabled={item.quantity <= 1}
          >
            <Ionicons
              name="remove"
              size={16}
              color={item.quantity <= 1 ? colors.lightGray : colors.dark}
            />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, 1)}
          >
            <Ionicons name="add" size={16} color={colors.dark} />
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
  
  if (loading) {
    return <Loading visible={true} text="Loading platter details..." />;
  }
  
  if (!platter) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color={colors.error} />
        <Text style={styles.errorText}>Failed to load platter details</Text>
        <Button
          title="Try Again"
          onPress={fetchPlatter}
          style={styles.retryButton}
        />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.platterInfoContainer}>
          <Image
            source={{ uri: platter.image || getRandomImage('foodPlatters') }}
            style={styles.platterImage}
            resizeMode="cover"
          />
          <View style={styles.platterInfo}>
            <Text style={styles.platterName}>{platter.name}</Text>
            <Text style={styles.platterServingSize}>Serves {platter.servingSize} people</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Original Price:</Text>
              <Text style={styles.price}>{formatCurrency(platter.price)}</Text>
            </View>
          </View>
        </View>
        
        <Card style={styles.instructionsCard}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <TextInput
            style={styles.instructionsInput}
            placeholder="Add any special instructions or dietary requirements"
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </Card>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customize Items</Text>
          <Text style={styles.sectionSubtitle}>
            Select or deselect items to customize your platter
          </Text>
          
          <FlatList
            data={selectedItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.itemsList}
          />
        </View>
      </ScrollView>
      
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Price:</Text>
          <Text style={styles.totalPrice}>{formatCurrency(getTotalPrice())}</Text>
        </View>
        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.saveButton}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.dark,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    width: 150,
  },
  platterInfoContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  platterImage: {
    width: 120,
    height: 120,
  },
  platterInfo: {
    flex: 1,
    padding: 16,
  },
  platterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  platterServingSize: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: colors.gray,
    marginRight: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  instructionsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: 12,
    height: 80,
    fontSize: 14,
    color: colors.dark,
  },
  section: {
    marginBottom: 24,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 16,
  },
  itemsList: {
    paddingBottom: 8,
  },
  itemCard: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: colors.gray,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.bgLight,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.bgLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
    marginHorizontal: 16,
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
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  saveButton: {
    width: 150,
  },
});

export default CustomPlattersScreen;
