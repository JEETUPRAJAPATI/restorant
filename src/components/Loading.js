import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Modal } from 'react-native';
import { colors } from '../constants/colors';
import LottieView from 'lottie-react-native';

const Loading = ({ visible = false, text = 'Loading...', overlayType = 'full', animation = null }) => {
  
  // If it's not visible, don't render anything
  if (!visible) return null;
  
  // If it's inline loading, render directly in the component
  if (overlayType === 'inline') {
    return (
      <View style={styles.inlineContainer}>
        {animation ? (
          <LottieView
            source={animation}
            autoPlay
            loop
            style={styles.lottie}
          />
        ) : (
          <ActivityIndicator size="large" color={colors.primary} />
        )}
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    );
  }
  
  // For full screen or modal overlay
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
    >
      <View style={
        overlayType === 'full' 
          ? styles.fullScreenContainer 
          : styles.modalContainer
      }>
        <View style={styles.loadingContainer}>
          {animation ? (
            <LottieView
              source={animation}
              autoPlay
              loop
              style={styles.lottie}
            />
          ) : (
            <ActivityIndicator size="large" color={colors.primary} />
          )}
          {text && <Text style={styles.text}>{text}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  inlineContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 200,
    minHeight: 120,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: colors.dark,
    textAlign: 'center',
  },
  lottie: {
    width: 100,
    height: 100,
  },
});

export default Loading;
