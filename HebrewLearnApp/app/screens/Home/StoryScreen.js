// app/screens/Home/StoryScreen.js
import React, { useEffect, useState, useRef } from "react";
import { View, ScrollView, StyleSheet, Animated } from "react-native";
import { Text, Button, ActivityIndicator, Card } from "react-native-paper";

export default function StoryScreen({ route, navigation }) {
  const { storyId } = route.params;
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Animation values: fade and slide up
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    fetchStory();
  }, []);

  const fetchStory = async () => {
    try {
      const response = await fetch(
        `https://hebrew-backend-8sozbbz4w-faeiz17s-projects.vercel.app/api/stories/${storyId}`
      );
      const data = await response.json();
      setStory(data);
      // Animate the content after data is loaded
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error("Error fetching story:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading story...</Text>
      </View>
    );
  }

  if (!story) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="bodyLarge" style={{ color: "red" }}>
          Failed to load story. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View
        style={[
          styles.animatedCard,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.storyTitle}>
              {story.hebrew}
            </Text>
            <Text variant="bodyMedium" style={styles.transliteration}>
              {story.transliteration}
            </Text>
            <Text variant="bodySmall" style={styles.translation}>
              {story.english}
            </Text>
          </Card.Content>
        </Card>
      </Animated.View>

      <Animated.View
        style={[
          styles.animatedButtonContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Exercise", { storyId })}
          style={styles.exerciseButton}
          contentStyle={styles.buttonContent}
        >
          Start Exercises
        </Button>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animatedCard: {
    marginBottom: 24,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: "#fff",
  },
  storyTitle: {
    marginBottom: 12,
    textAlign: "right", // Hebrew text typically aligns to the right
    fontWeight: "bold",
    fontSize: 22,
  },
  transliteration: {
    marginBottom: 8,
    fontStyle: "italic",
    color: "#3b82f6",
    fontSize: 18,
  },
  translation: {
    color: "#666",
    fontSize: 16,
  },
  animatedButtonContainer: {
    marginTop: 16,
  },
  exerciseButton: {
    backgroundColor: "#3b82f6",
  },
  buttonContent: {
    paddingVertical: 10,
  },
});
