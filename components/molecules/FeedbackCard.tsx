import { useTheme } from "@/utils/theme-engine";
import React from "react";
import { View, StyleSheet, Image } from "react-native";
import * as Animatable from "react-native-animatable";
import { Surface } from "react-native-paper";

import { Images } from "@/assets/images";
import { Text } from "@/atoms";

interface FeedbackCardProps {
  isCorrect: boolean;
  isVisible: boolean;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  isCorrect,
  isVisible,
}) => {
  const { theme } = useTheme();
  if (!isVisible) return null;

  const imageSource = isCorrect ? Images.Trophy : Images.HoopoeFaceLocked;
  const title = isCorrect ? "Correct!" : "Incorrect!";
  const feedbackColor = isCorrect ? "#4CAF50" : "#F44336";

  return (
    <Animatable.View animation="fadeInUp" duration={500} style={styles.container}>
      <Surface style={[
        styles.card,
        {
          backgroundColor: isCorrect ? "rgba(76, 175, 80, 0.08)" : "rgba(244, 67, 54, 0.08)",
          borderColor: feedbackColor,
          borderRadius: theme.radius[300]
        }
      ]}>
        <View style={styles.header}>
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
          <Text
            variant="h3"
            style={[theme.styles.headingM, { color: feedbackColor }]}
          >
            {title}
          </Text>
        </View>
        <Text variant="body" style={styles.message}>
          {isCorrect
            ? "Excellent! You're mastering this story."
            : "Not quite yet. Keep practicing to improve!"}
        </Text>
      </Surface>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    padding: 20,
    borderWidth: 1.5,
    elevation: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  message: {
    color: "#555",
    fontSize: 16,
    lineHeight: 22,
  },
});

export default FeedbackCard;
