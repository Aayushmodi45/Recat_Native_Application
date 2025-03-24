import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, ScrollView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';

const imageData = [
  {
    title: 'Nature View',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1NTUtVw3i311Z8hKu7b1LmD7Wi-m_1WNbqg&s',
    description: 'A beautiful view of nature with lush green trees and a serene atmosphere.',
  },
  {
    title: 'Mountain View',
    imageUrl: 'https://media.istockphoto.com/id/182367596/photo/sunset-over-himayas.jpg?s=612x612&w=0&k=20&c=rOsNuAv0BLi3AWwKQ_Hz_J9kN7U__ChFo9lGveq7Mh4=',
    description: 'A stunning mountain landscape with snowy peaks touching the clouds.',
  },
  {
    title: 'Beach View',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1669748157617-a3a83cc8ea23?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2VhJTIwYmVhY2h8ZW58MHx8MHx8fDA%3D',
    description: 'Relax at the sandy shores with crystal-clear waters and a breathtaking sunset.',
  },
  {
    title: 'City View',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1673483585933-93ab140492d3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2l0eSUyMHZpZXd8ZW58MHx8MHx8fDA%3D',
    description: 'A dazzling city skyline with bright lights and modern architecture.',
  },
];

const CollapsibleCards = () => {
  const [collapsedState, setCollapsedState] = useState(
    new Array(imageData.length).fill(true)
  );
  const [animation] = useState(new Animated.Value(0));

  const toggleCard = (index) => {
    setCollapsedState((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];

      Animated.timing(animation, {
        toValue: newState[index] ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }).start();

      return newState;
    });
  };

  return (
    <ScrollView style={styles.container}>
      {imageData.map((item, index) => (
        <View key={index} style={styles.card}>
          <TouchableOpacity style={styles.header} onPress={() => toggleCard(index)}>
            <Text style={styles.headerText}>{item.title}</Text>
            <Icon
              name={collapsedState[index] ? 'expand-more' : 'expand-less'}
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
          <Collapsible collapsed={collapsedState[index]}>
            <Animated.View style={[styles.content, { opacity: animation }]}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <Text style={styles.description}>{item.description}</Text>
            </Animated.View>
          </Collapsible>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#E3F2FD', // Light blue background
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    backgroundColor: '#0072ff',
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  description: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginTop: 8,
  },
});

export default CollapsibleCards;
