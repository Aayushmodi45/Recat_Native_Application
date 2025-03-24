import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade-in effect
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Scale-up effect for title
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1500,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start();

    // Rotating effect for loading
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // ✅ Check if navigation exists before calling replace
    const timeout = setTimeout(() => {
      if (navigation && navigation.replace) {
        navigation.replace("RegisterScreen");
      }
    }, 5000);

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, [navigation]);

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.container}>
      <Animated.Text style={[styles.title, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        Welcome to My App 🚀
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        The Future is Here ✨
      </Animated.Text>
      <Animated.View style={[styles.loaderContainer, { transform: [{ rotate: rotateInterpolation }] }]}>
        <ActivityIndicator size="large" color="#fff" />
      </Animated.View>
      <View style={styles.waveContainer}>
        <Svg height="100" width="100%" viewBox="0 0 1440 320">
          <Path
            fill="#ffffff"
            d="M0,224L48,218.7C96,213,192,203,288,186.7C384,171,480,149,576,154.7C672,160,768,192,864,213.3C960,235,1056,245,1152,234.7C1248,224,1344,192,1392,176L1440,160L1440,320L0,320Z"
          />
        </Svg>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    marginTop: 10,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  loaderContainer: {
    marginTop: 20,
  },
  waveContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

export default SplashScreen;
