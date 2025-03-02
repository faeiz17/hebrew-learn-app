// app/screens/Home/SplashScreen.js
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Text } from "react-native-paper";

export default function SplashScreen() {
  // Create animated values for opacity and scale
  const fadeAnim = useRef(new Animated.Value(0)).current; // initial opacity: 0
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // initial scale: 0.8

  useEffect(() => {
    // Run parallel animations: fade in and scale in
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
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text variant="headlineLarge" style={styles.text}>
          HebrewLearnApp
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  animatedContainer: {
    // Additional styling (optional)
  },
  text: {
    color: "#3b82f6", // a modern blue tone
    fontWeight: "bold",
  },
});
