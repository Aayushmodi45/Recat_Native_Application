import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { insertUser } from "./Database";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function AddUserScreen() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const mobileRegex = /^\d{10}$/;

  const handleAddUser = () => {
    if (!name || !age || !mobile || !email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    if (!mobileRegex.test(mobile)) {
      Alert.alert("Error", "Mobile number must be exactly 10 digits");
      return;
    }
    if (!passwordRegex.test(password)) {
      Alert.alert("Error", "Password must have 8+ chars, 1 uppercase, 1 number, 1 special");
      return;
    }

    insertUser(name, parseInt(age), mobile, email, password);
    Alert.alert("Success", "User Added Successfully");
    setName(""); setAge(""); setMobile(""); setEmail(""); setPassword("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New User</Text>
      {[{ icon: "person", value: name, setter: setName, placeholder: "Name" },
        { icon: "calendar-today", value: age, setter: setAge, placeholder: "Age", keyboardType: "numeric" },
        { icon: "phone", value: mobile, setter: setMobile, placeholder: "Mobile", keyboardType: "phone-pad", maxLength: 10 },
        { icon: "email", value: email, setter: setEmail, placeholder: "Email", keyboardType: "email-address" },
        { icon: "lock", value: password, setter: setPassword, placeholder: "Password", secureTextEntry: true }]
        .map(({ icon, value, setter, ...props }, index) => (
          <View key={index} style={styles.inputContainer}>
            <Icon name={icon} size={20} color="#555" style={styles.icon} />
            <TextInput style={styles.input} value={value} onChangeText={setter} {...props} />
          </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleAddUser}>
        <Text style={styles.buttonText}>Add User</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
}); 