import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function SqliteDatabase({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Management</Text>

      <View style={styles.buttonContainer}>
        {[
          { screen: "AddUserScreen", icon: "account-plus", text: "Add User", color: "#00C853" },
          { screen: "DeleteUserScreen", icon: "account-remove", text: "Delete User", color: "#D50000" },
          { screen: "ShowUsersScreen", icon: "account-group", text: "Show Users", color: "#2962FF" },
          { screen: "UpdateUserModal", icon: "account-edit", text: "Update User", color: "#FF6D00" },
        ].map(({ screen, icon, text, color }, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, { backgroundColor: color, shadowColor: color }]}
            onPress={() => navigation.navigate(screen)}
            activeOpacity={0.7}
          >
            <Icon name={icon} size={24} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>{text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#E0F7FA",  // Light blue background
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    width: "85%",
    borderRadius: 12,
    marginVertical: 10,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
});

