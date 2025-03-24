import React, { useState } from "react";
import { 
  View, Text, TouchableOpacity, Image, ScrollView, Alert, StyleSheet 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const PdfGenerator = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [pdfPath, setPdfPath] = useState(null);

  // Function to pick images from gallery
  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages(result.assets.map((asset) => asset.uri));

      // Show toast when images are selected
      Toast.show({
        type: "success",
        text1: "Images Selected",
        text2: `${result.assets.length} images added successfully`,
        visibilityTime: 2000,
      });
    }
  };

  // Convert images to Base64 for embedding in PDF
  const convertImagesToBase64 = async () => {
    return await Promise.all(
      selectedImages.map(async (imageUri) => {
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        return `data:image/jpeg;base64,${base64}`;
      })
    );
  };

  // Create a PDF with proper page breaks
  const createPDF = async () => {
    if (selectedImages.length === 0) {
      Alert.alert("No images selected", "Please select images to create a PDF.");
      return;
    }

    try {
      const base64Images = await convertImagesToBase64();

      let htmlContent = `
        <html>
          <head>
            <style>
              body { text-align: center; font-family: Arial, sans-serif; }
              .page { page-break-after: always; margin: 0; padding: 0; }
              img { width: 100%; height: auto; max-height: 90vh; }
            </style>
          </head>
          <body>
            ${base64Images
              .map((base64Image) => `<div class="page"><img src="${base64Image}" /></div>`)
              .join("")}
          </body>
        </html>`;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      setPdfPath(uri);

      // Show toast when PDF is created
      Toast.show({
        type: "success",
        text1: "PDF Created",
        text2: "Your PDF has been generated successfully",
        visibilityTime: 2000,
      });

    } catch (error) {
      Alert.alert("Error", "Failed to create PDF: " + error.message);
    }
  };

  // Function to open the generated PDF
  const openPDF = async () => {
    if (pdfPath && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(pdfPath);
    } else {
      Alert.alert("Error", "Unable to open the PDF.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📸 Image to PDF Converter</Text>

      {/* Pick Image Button */}
      <TouchableOpacity style={styles.button} onPress={pickImages}>
        <Icon name="image-multiple" size={24} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>Select Images</Text>
      </TouchableOpacity>

      {/* Image Preview */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
        {selectedImages.map((imageUri, index) => (
          <Image key={index} source={{ uri: imageUri }} style={styles.imagePreview} />
        ))}
      </ScrollView>

      {/* Create PDF Button */}
      <TouchableOpacity style={styles.button} onPress={createPDF}>
        <Icon name="file-pdf-box" size={24} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>Create PDF</Text>
      </TouchableOpacity>

      {/* Open PDF Button (Only Show if PDF is Created) */}
      {pdfPath && (
        <TouchableOpacity style={styles.button} onPress={openPDF}>
          <Icon name="folder-open-outline" size={24} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Open PDF</Text>
        </TouchableOpacity>
      )}

      {/* Toast Message Component */}
      <Toast />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f7f9fc",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 50,
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
    elevation: 3, // For Android shadow effect
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
  imageScroll: {
    marginVertical: 15,
    paddingHorizontal: 5,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
});

export default PdfGenerator;
