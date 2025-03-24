import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';

const BarcodeGenerator = () => {
  const [inputValue, setInputValue] = useState('');
  const [barcodeValue, setBarcodeValue] = useState('');
  const scaleAnim = new Animated.Value(1);

  const generateBarcode = () => {
    if (inputValue.trim() !== '') {
      setBarcodeValue(inputValue);
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    } else {
      alert('Please enter a valid input.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Text style={styles.title}>Get Your Own Barcode</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter text or number"
        value={inputValue}
        onChangeText={setInputValue}
        placeholderTextColor="#aaa"
      />
      
      {/* Animated Button */}
      <TouchableOpacity onPress={generateBarcode} activeOpacity={0.8}>
        <LinearGradient colors={['#2196F3', '#1E88E5']} style={styles.button}>
          <Text style={styles.buttonText}>Generate Barcode</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      <Animated.View style={[styles.barcodeContainer, { transform: [{ scale: scaleAnim }] }]}>
        {barcodeValue ? (
          <QRCode value={barcodeValue} size={200} backgroundColor="white" color="black" />
        ) : (
          <Text style={styles.placeholderText}>Enter text & press "Generate"</Text>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginBottom: 20,
    letterSpacing: 1,
  },
  input: {
    width: '90%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#1E88E5',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontSize: 16,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  barcodeContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  placeholderText: {
    fontSize: 16,
    color: '#555',
  },
});

export default BarcodeGenerator;
