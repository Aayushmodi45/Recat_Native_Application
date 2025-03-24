import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import * as Location from "expo-location";

const LocationPage = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
    getAddressFromCoordinates(
      currentLocation.coords.latitude,
      currentLocation.coords.longitude
    );
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        let locationDetails = reverseGeocode[0];
        let formattedAddress = `${locationDetails.name}, ${locationDetails.street}, ${locationDetails.city}, ${locationDetails.region}, ${locationDetails.country}`;
        setAddress(formattedAddress);
      } else {
        setAddress("Address not found");
      }
    } catch (error) {
      setErrorMsg("Error fetching address");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>User Location</Text>
      {errorMsg ? (
        <Text style={{ color: "red" }}>{errorMsg}</Text>
      ) : location ? (
        <>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <Text>Address: {address ? address : "Fetching address..."}</Text>
        </>
      ) : (
        <Text>Fetching location...</Text>
      )}
      <Button title="Get Location" onPress={requestLocationPermission} />
    </View>
  );
};

export default LocationPage;
