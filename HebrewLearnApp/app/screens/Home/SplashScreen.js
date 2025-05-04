// app/screens/Home/SplashScreen.js
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Image } from "react-native";
import { Text } from "react-native-paper";

const hoopoeSplash = require("../../../assets/HoopoeSplash.png");
// ^ Adjust path as needed

export default function SplashScreen() {
  // Create animated values for opacity (fade) and scale
  const fadeAnim = useRef(new Animated.Value(0)).current; // initial opacity: 0
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // initial scale: 0.8

  useEffect(() => {
    // Run parallel animations: fade in & scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image source={hoopoeSplash} style={styles.birdImage} />
        <Text style={styles.loadingText}>Loading...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#41B2EB", // Bright blue background
    justifyContent: "center",
    alignItems: "center",
  },
  animatedContainer: {
    alignItems: "center",
  },
  birdImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  loadingText: {
    marginTop: 16,
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
