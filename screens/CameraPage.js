import React, { useState, useEffect } from "react";
import { View, Text, Image, Alert, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"; 

const CameraPage = () => {
  const [galleryImage, setGalleryImage] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const firstName = await AsyncStorage.getItem("firstName");
        if (firstName) {
          setUserName(firstName);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    getUserInfo();
  }, []);
  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Allow access to photos to select an image.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setGalleryImage(result.assets[0].uri);
    }
  };

  const captureImage = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Allow access to the camera to take a picture.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCameraImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📸 Capture & Select Image</Text>

      {/* Custom Buttons */}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <MaterialIcons name="photo-library" size={24} color="#fff" />
        <Text style={styles.buttonText}>Select from Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.cameraButton]} onPress={captureImage}>
        <FontAwesome name="camera" size={24} color="#fff" />
        <Text style={styles.buttonText}>Capture with Camera</Text>
      </TouchableOpacity>

      {/* Display Images */}
      <View style={styles.imageContainer}>
        {galleryImage && (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: galleryImage }} style={styles.image} />
            <Text style={styles.label}>📂 From Gallery</Text>
          </View>
        )}

        {cameraImage && (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: cameraImage }} style={styles.image} />
            <Text style={styles.label}>📸 From Camera</Text>
          </View>
        )}
      </View>

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: "80%",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cameraButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  imageWrapper: {
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  label: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default CameraPage;
