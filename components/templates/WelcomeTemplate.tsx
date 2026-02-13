import React from "react";
import { View, StyleSheet, ImageBackground, ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";

import { Images } from "@/assets/images";
import { Text, Button } from "@/atoms";
import { User } from "@/types";

interface WelcomeTemplateProps {
  user: User | null;
  onContinueLearning: () => void;
  onTryDemo: () => void;
  onSignInDemo: () => void;
}

const patternBackground = Images.BackgroundPattern;
const hoopoeHappy = Images.HoopoeFace;

const WelcomeTemplate: React.FC<WelcomeTemplateProps> = ({
  user,
  onContinueLearning,
  onTryDemo,
  onSignInDemo,
}) => {
  return (
    <ImageBackground
      source={patternBackground}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundPattern}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Animatable.View
          animation="fadeInDown"
          duration={1000}
          style={styles.header}
        >
          <Text variant="h1" style={styles.title}>
            Welcome to Hebrew Learn
          </Text>
          <Text variant="body" style={styles.subtitle}>
            {user?.name || "Explorer"}!
          </Text>
        </Animatable.View>

        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          duration={3000}
          style={styles.mascotContainer}
        >
          <ImageBackground
            source={hoopoeHappy}
            style={{ width: 150, height: 150 }}
            resizeMode="contain"
          />
        </Animatable.View>

        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            onPress={onContinueLearning}
            style={styles.button}
          >
            Continue Learning
          </Button>

          <Button mode="outlined" onPress={onTryDemo} style={styles.button}>
            Try Demo Exercise
          </Button>
        </View>

        {!user && (
          <Button mode="text" onPress={onSignInDemo}>
            Sign In (Demo)
          </Button>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  backgroundPattern: {
    opacity: 0.05,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontWeight: "300",
    color: "#333",
  },
  subtitle: {
    fontWeight: "bold",
    color: "#41B2EB",
  },
  mascotContainer: {
    marginBottom: 40,
  },
  actionsContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 6,
  },
});

export default WelcomeTemplate;
