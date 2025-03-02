// app/screens/Home/LevelsScreen.js
import React, { useEffect, useState, useContext } from "react";
import { ScrollView, View, StyleSheet, Animated } from "react-native";
import {
  Text,
  Button,
  ActivityIndicator,
  Card,
  Paragraph,
  Avatar,
} from "react-native-paper";
import { AuthContext } from "../../contexts/AuthContext";

export default function LevelsScreen({ navigation }) {
  const { unlockedLevel } = useContext(AuthContext);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Animation value for the cards container
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchAllStories();
  }, []);

  const fetchAllStories = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://hebrew-backend-44h3.vercel.app/api/stories"
      );
      const data = await response.json();
      // Sort stories by difficulty: easy -> medium -> hard
      const sorted = sortStoriesByDifficulty(data);
      setStories(sorted);
      // Animate the list fade-in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortStoriesByDifficulty = (storiesArray) => {
    const priority = { easy: 1, medium: 2, hard: 3 };
    return storiesArray
      .slice()
      .sort((a, b) => priority[a.level] - priority[b.level]);
  };

  const handleLevelPress = (story, index) => {
    const levelNumber = index + 1;
    if (levelNumber <= unlockedLevel) {
      navigation.navigate("Story", { storyId: story._id });
    } else {
      alert("This level is locked. Complete previous levels first!");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 8 }}>Loading stories...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.pageTitle}>
        Select a Level
      </Text>
      <Text variant="bodyMedium" style={styles.subtext}>
        Stories are sorted by difficulty: easy, then medium, then hard.
      </Text>
      <Animated.View style={{ opacity: fadeAnim }}>
        {stories.map((story, index) => {
          const levelNumber = index + 1;
          const isUnlocked = levelNumber <= unlockedLevel;
          return (
            <Card key={story._id} style={styles.card}>
              <Card.Title
                title={`Level ${levelNumber}`}
                subtitle={story.level.toUpperCase()}
                left={() =>
                  isUnlocked ? (
                    <Avatar.Icon
                      size={40}
                      icon="check-circle"
                      style={{ backgroundColor: "#3b82f6" }}
                    />
                  ) : (
                    <Avatar.Icon
                      size={40}
                      icon="lock"
                      style={{ backgroundColor: "#ccc" }}
                    />
                  )
                }
              />
              <Card.Content>
                <Paragraph style={styles.previewText}>
                  {story.hebrew.slice(0, 30)}...
                </Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button
                  mode="contained"
                  onPress={() => handleLevelPress(story, index)}
                  disabled={!isUnlocked}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  {isUnlocked ? "Start" : "Locked"}
                </Button>
              </Card.Actions>
            </Card>
          );
        })}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  pageTitle: {
    marginBottom: 4,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtext: {
    marginBottom: 16,
    textAlign: "center",
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginVertical: 8,
    borderRadius: 12,
    elevation: 4,
  },
  previewText: {
    color: "#555",
  },
  button: {
    marginLeft: "auto",
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
