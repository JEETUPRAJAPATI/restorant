import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { colors } from '../constants/colors';
import Button from './Button';
import PriceRange from './PriceRange';

const partyTypes = [
  { id: 1, name: 'Birthday' },
  { id: 2, name: 'Anniversary' },
  { id: 3, name: 'Corporate' },
  { id: 4, name: 'Wedding' },
  { id: 5, name: 'Casual Gathering' },
  { id: 6, name: 'Engagement' },
  { id: 7, name: 'Bachelor/Bachelorette' },
  { id: 8, name: 'Holiday' },
  { id: 9, name: 'Graduation' },
  { id: 10, name: 'Baby Shower' },
];

const FilterModal = ({ visible, onClose, initialFilters = {}, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    partyType: null,
    groupSize: 4,
    priceRange: 2,
    distance: 10,
    ...initialFilters,
  });

  useEffect(() => {
    if (initialFilters) {
      setFilters({
        partyType: null,
        groupSize: 4,
        priceRange: 2,
        distance: 10,
        ...initialFilters,
      });
    }
  }, [initialFilters, visible]);

  const handleSelectPartyType = (partyType) => {
    setFilters(prev => ({
      ...prev,
      partyType: prev.partyType === partyType.id ? null : partyType.id
    }));
  };

  const handleReset = () => {
    setFilters({
      partyType: null,
      groupSize: 4,
      priceRange: 2,
      distance: 10,
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.dark} />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Party Type</Text>
              <View style={styles.partyTypeContainer}>
                {partyTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.partyTypeItem,
                      filters.partyType === type.id && styles.selectedPartyType,
                    ]}
                    onPress={() => handleSelectPartyType(type)}
                  >
                    <Text 
                      style={[
                        styles.partyTypeText,
                        filters.partyType === type.id && styles.selectedPartyTypeText,
                      ]}
                    >
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Group Size</Text>
              <Text style={styles.sliderValue}>{filters.groupSize} people</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={50}
                step={1}
                value={filters.groupSize}
                onValueChange={(value) => setFilters(prev => ({ ...prev, groupSize: value }))}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.lightGray}
                thumbTintColor={colors.primary}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>1</Text>
                <Text style={styles.sliderLabel}>25</Text>
                <Text style={styles.sliderLabel}>50</Text>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <PriceRange
                value={filters.priceRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
              />
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Distance</Text>
              <Text style={styles.sliderValue}>{filters.distance} km</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={30}
                step={1}
                value={filters.distance}
                onValueChange={(value) => setFilters(prev => ({ ...prev, distance: value }))}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.lightGray}
                thumbTintColor={colors.primary}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>1 km</Text>
                <Text style={styles.sliderLabel}>15 km</Text>
                <Text style={styles.sliderLabel}>30 km</Text>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <Button 
              title="Reset" 
              type="outline" 
              onPress={handleReset} 
              style={styles.resetButton}
            />
            <Button 
              title="Apply Filters" 
              onPress={handleApply} 
              style={styles.applyButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
  },
  partyTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  partyTypeItem: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedPartyType: {
    backgroundColor: colors.primary,
  },
  partyTypeText: {
    color: colors.dark,
    fontSize: 14,
  },
  selectedPartyTypeText: {
    color: colors.white,
  },
  sliderValue: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    color: colors.gray,
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  resetButton: {
    flex: 1,
    marginRight: 8,
  },
  applyButton: {
    flex: 2,
    marginLeft: 8,
  },
});

export default FilterModal;
