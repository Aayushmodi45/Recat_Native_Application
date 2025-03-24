import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const staticUser = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", image: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "987-654-3210", image: "https://randomuser.me/api/portraits/women/2.jpg" },
  { id: 3, name: "Alice Johnson", email: "alice@example.com", phone: "555-666-7777", image: "https://randomuser.me/api/portraits/women/3.jpg" },
  { id: 4, name: "Michael Brown", email: "michael@example.com", phone: "444-333-2222", image: "https://randomuser.me/api/portraits/men/4.jpg" },
  { id: 5, name: "Emma Wilson", email: "emma@example.com", phone: "111-222-3333", image: "https://randomuser.me/api/portraits/women/5.jpg" },
  { id: 6, name: "Liam Martinez", email: "liam@example.com", phone: "999-888-7777", image: "https://randomuser.me/api/portraits/men/6.jpg" },
  { id: 7, name: "Sophia Anderson", email: "sophia@example.com", phone: "777-666-5555", image: "https://randomuser.me/api/portraits/women/7.jpg" },
  { id: 8, name: "Noah Taylor", email: "noah@example.com", phone: "666-555-4444", image: "https://randomuser.me/api/portraits/men/8.jpg" },
  { id: 9, name: "Olivia White", email: "olivia@example.com", phone: "333-222-1111", image: "https://randomuser.me/api/portraits/women/9.jpg" },
  { id: 10, name: "William Harris", email: "william@example.com", phone: "555-777-9999", image: "https://randomuser.me/api/portraits/men/10.jpg" },
  { id: 11, name: "Mia Clark", email: "mia@example.com", phone: "888-999-0000", image: "https://randomuser.me/api/portraits/women/11.jpg" },
  { id: 12, name: "James Lewis", email: "james@example.com", phone: "222-333-4444", image: "https://randomuser.me/api/portraits/men/12.jpg" },
  { id: 13, name: "Charlotte Walker", email: "charlotte@example.com", phone: "444-555-6666", image: "https://randomuser.me/api/portraits/women/13.jpg" },
  { id: 14, name: "Benjamin Hall", email: "benjamin@example.com", phone: "666-777-8888", image: "https://randomuser.me/api/portraits/men/14.jpg" },
];

const StaticUsers = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [animatedValues, setAnimatedValues] = useState(
    staticUser.reduce((acc, user) => {
      acc[user.id] = new Animated.Value(0);
      return acc;
    }, {})
  );

  const toggleExpand = (id) => {
    const isExpanded = expandedId === id;
    setExpandedId(isExpanded ? null : id);

    Animated.timing(animatedValues[id], {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={staticUser}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const heightInterpolation = animatedValues[item.id].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 100],
          });

          return (
            <View style={styles.card}>
              <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand(item.id)}>
                <MaterialIcons name="person" size={24} color="#27ae60" />
                <Text style={styles.text}>{item.name}</Text>
                <MaterialIcons name={expandedId === item.id ? "expand-less" : "expand-more"} size={24} color="#27ae60" />
              </TouchableOpacity>
              
              <Animated.View style={[styles.details, { height: heightInterpolation }]}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.detailText}>📧 {item.email}</Text>
                <Text style={styles.detailText}>📞 {item.phone}</Text>
              </Animated.View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#ecf0f1",
  },
  card: {
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
    marginLeft: 10,
  },
  details: {
    overflow: "hidden",
    padding: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#34495e",
    marginVertical: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: "center",
    marginBottom: 5,
  },
});

export default StaticUsers;
