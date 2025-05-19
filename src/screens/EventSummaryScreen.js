import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import Button from '../components/Button';
import Card from '../components/Card';
import Loading from '../components/Loading';
import { getRandomImage } from '../constants/images';
import { formatCurrency, formatDate } from '../utils/helpers';

const EventSummaryScreen = ({ route, navigation }) => {
  const {
    restaurantId,
    restaurantName,
    selectedPlatters = [],
    selectedAddons = [],
    partySize = 4,
    totalCost = 0,
  } = route.params;

  const [loading, setLoading] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [eventDate, setEventDate] = useState(null);
  const [eventTime, setEventTime] = useState('19:00');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventName, setEventName] = useState('');
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleDateConfirm = () => {
    setEventDate(selectedDate);
    setDateModalVisible(false);
  };

  const handleNameConfirm = () => {
    if (!eventName.trim()) {
      Alert.alert('Please enter an event name');
      return;
    }
    setNameModalVisible(false);
  };

  const handleBookEvent = async () => {
    if (!eventDate) {
      Alert.alert('Please select a date for your event');
      return;
    }

    if (!eventName) {
      setNameModalVisible(true);
      return;
    }

    try {
      setLoading(true);

      // In a real app, we would make an API call to the backend to book the event
      // const response = await bookEvent({...})

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setBookingSuccess(true);
    } catch (error) {
      Alert.alert(
        'Booking Failed',
        'There was a problem booking your event. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoToHomeScreen = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  const renderBookingSuccess = () => (
    <View style={styles.successContainer}>
      <View style={styles.successIconContainer}>
        <Ionicons name="checkmark-circle" size={80} color={colors.success} />
      </View>
      <Text style={styles.successTitle}>Booking Confirmed!</Text>
      <Text style={styles.successMessage}>
        Your event "{eventName}" has been successfully booked for{' '}
        {formatDate(eventDate)} at {eventTime}.
      </Text>
      <Text style={styles.successRestaurant}>
        Restaurant: {restaurantName}
      </Text>
      <Text style={styles.successParty}>
        Party Size: {partySize} people
      </Text>
      <Text style={styles.successTotal}>
        Total: {formatCurrency(totalCost)}
      </Text>
      <Button
        title="Return to Home"
        onPress={handleGoToHomeScreen}
        style={styles.homeButton}
      />
    </View>
  );

  if (loading) {
    return <Loading visible={true} text="Booking your event..." />;
  }

  if (bookingSuccess) {
    return renderBookingSuccess();
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.restaurantCard}>
          <View style={styles.restaurantInfo}>
            <Image
              source={{ uri: getRandomImage('restaurantInteriors') }}
              style={styles.restaurantImage}
              resizeMode="cover"
            />
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantName}>{restaurantName}</Text>
              <Text style={styles.partySize}>
                <Ionicons name="people" size={16} color={colors.gray} /> {partySize} people
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.dateTimeCard}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setDateModalVisible(true)}
          >
            <View style={styles.dateInfoContainer}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <Text style={styles.dateText}>
                {eventDate ? formatDate(eventDate) : 'Select a date'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>

          <View style={styles.timeSelector}>
            <Text style={styles.timeLabel}>Time:</Text>
            <View style={styles.timeOptionsContainer}>
              {['18:00', '18:30', '19:00', '19:30', '20:00'].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeOption,
                    eventTime === time && styles.selectedTimeOption,
                  ]}
                  onPress={() => setEventTime(time)}
                >
                  <Text
                    style={[
                      styles.timeText,
                      eventTime === time && styles.selectedTimeText,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        <Card style={styles.eventNameCard}>
          <Text style={styles.sectionTitle}>Event Name</Text>
          <TouchableOpacity
            style={styles.eventNameButton}
            onPress={() => setNameModalVisible(true)}
          >
            <View style={styles.eventNameInfo}>
              <Ionicons name="create" size={20} color={colors.primary} />
              <Text style={styles.eventNameText}>
                {eventName || 'Add event name'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>
        </Card>

        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.summarySection}>
            <Text style={styles.summarySectionTitle}>Platters</Text>
            {selectedPlatters.map((platter) => (
              <View key={platter.id} style={styles.summaryItem}>
                <Text style={styles.summaryItemName}>{platter.name}</Text>
                <Text style={styles.summaryItemPrice}>
                  {formatCurrency(platter.price)}
                </Text>
              </View>
            ))}
          </View>

          {selectedAddons.length > 0 && (
            <View style={styles.summarySection}>
              <Text style={styles.summarySectionTitle}>Add-ons</Text>
              {selectedAddons.map((addon) => (
                <View key={addon.id} style={styles.summaryItem}>
                  <View style={styles.addonInfo}>
                    <Text style={styles.summaryItemName}>{addon.name}</Text>
                    {addon.quantity > 1 && (
                      <Text style={styles.quantityText}>x{addon.quantity}</Text>
                    )}
                  </View>
                  <Text style={styles.summaryItemPrice}>
                    {formatCurrency(addon.price * addon.quantity)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{formatCurrency(totalCost)}</Text>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          title="Book Event"
          onPress={handleBookEvent}
          style={styles.bookButton}
        />
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={dateModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setDateModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarContainer}>
              {/* Simplified calendar view - in a real app, you'd use a proper calendar component */}
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarMonth}>
                  {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                </Text>
              </View>
              <View style={styles.calendarDays}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <Text key={day} style={styles.calendarDayName}>
                    {day}
                  </Text>
                ))}
              </View>
              <View style={styles.calendarDates}>
                {Array(31).fill(0).map((_, index) => {
                  const day = index + 1;
                  const date = new Date();
                  date.setDate(day);
                  const isSelected = selectedDate && 
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === date.getMonth();
                  
                  // Only show dates from today forward
                  const isInPast = date < new Date().setHours(0, 0, 0, 0);
                  const isAvailable = !isInPast && day % 5 !== 0; // Simulate some unavailable dates

                  return (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.calendarDateItem,
                        isSelected && styles.selectedDateItem,
                        !isAvailable && styles.unavailableDateItem,
                      ]}
                      onPress={() => isAvailable && handleDateSelect(date)}
                      disabled={!isAvailable}
                    >
                      <Text
                        style={[
                          styles.calendarDateText,
                          isSelected && styles.selectedDateText,
                          !isAvailable && styles.unavailableDateText,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Button title="Confirm Date" onPress={handleDateConfirm} />
          </View>
        </View>
      </Modal>

      {/* Event Name Modal */}
      <Modal
        visible={nameModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setNameModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Event Name</Text>
              <TouchableOpacity onPress={() => setNameModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.eventNameLabel}>
              Give your event a name for your booking
            </Text>
            <TextInput
              style={styles.eventNameInput}
              placeholder="e.g., John's Birthday, Team Dinner"
              value={eventName}
              onChangeText={setEventName}
              maxLength={50}
            />
            <Text style={styles.charactersLeft}>
              {50 - (eventName?.length || 0)} characters left
            </Text>

            <Button title="Confirm" onPress={handleNameConfirm} />
          </View>
        </View>
      </Modal>
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
    paddingBottom: 80,
  },
  restaurantCard: {
    marginBottom: 16,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  partySize: {
    fontSize: 14,
    color: colors.gray,
  },
  dateTimeCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  dateInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: colors.dark,
    marginLeft: 8,
  },
  timeSelector: {
    marginTop: 16,
  },
  timeLabel: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 8,
  },
  timeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.bgLight,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTimeOption: {
    backgroundColor: colors.primary,
  },
  timeText: {
    fontSize: 14,
    color: colors.dark,
  },
  selectedTimeText: {
    color: colors.white,
    fontWeight: '500',
  },
  eventNameCard: {
    marginBottom: 16,
  },
  eventNameButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  eventNameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventNameText: {
    fontSize: 16,
    color: colors.dark,
    marginLeft: 8,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summarySection: {
    marginBottom: 16,
  },
  summarySectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItemName: {
    fontSize: 14,
    color: colors.dark,
  },
  quantityText: {
    fontSize: 12,
    color: colors.gray,
    marginLeft: 8,
    backgroundColor: colors.bgLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  bookButton: {
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  calendarHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarMonth: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  calendarDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calendarDayName: {
    width: 32,
    textAlign: 'center',
    fontSize: 12,
    color: colors.gray,
    fontWeight: '500',
  },
  calendarDates: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDateItem: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  selectedDateItem: {
    backgroundColor: colors.primary,
  },
  unavailableDateItem: {
    opacity: 0.4,
  },
  calendarDateText: {
    fontSize: 14,
    color: colors.dark,
  },
  selectedDateText: {
    color: colors.white,
  },
  unavailableDateText: {
    color: colors.gray,
    textDecorationLine: 'line-through',
  },
  eventNameLabel: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 12,
  },
  eventNameInput: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.dark,
    marginBottom: 8,
  },
  charactersLeft: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'right',
    marginBottom: 20,
  },
  successContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  successRestaurant: {
    fontSize: 16,
    color: colors.dark,
    marginBottom: 8,
  },
  successParty: {
    fontSize: 16,
    color: colors.dark,
    marginBottom: 8,
  },
  successTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 32,
  },
  homeButton: {
    width: 200,
  },
});

export default EventSummaryScreen;
