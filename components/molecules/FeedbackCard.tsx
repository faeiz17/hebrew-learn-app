import { View, StyleSheet, Image, ImageSourcePropType } from "react-native";
import * as Animatable from "react-native-animatable";
import { Surface } from "react-native-paper";

import { Images } from "@/assets/images";
import { Text } from "@/atoms";

interface FeedbackCardProps {
  isCorrect: boolean;
  isVisible: boolean;
}

// Assets (Using require for now as in original, but could be passed as props)
// Adjust paths as needed for the new structure or pass them
const FeedbackCard: React.FC<FeedbackCardProps> = ({
  isCorrect,
  isVisible,
}) => {
  if (!isVisible) return null;

  const style = isCorrect ? styles.correct : styles.incorrect;
  const imageSource = isCorrect ? Images.Trophy : Images.HoopoeFaceLocked;
  const title = isCorrect ? "Correct!" : "Incorrect!";
  const message = isCorrect
    ? "Great job! You chose the right answer."
    : "Not quite. Try to remember the correct meaning.";

  // Determine feedback color based on correctness
  const feedbackColor = isCorrect ? "#4CAF50" : "#F44336";

  return (
    <Animatable.View animation="fadeIn" duration={500} style={styles.container}>
      <Surface style={StyleSheet.flatten([styles.card, style])}>
        <View style={styles.header}>
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
          <Text
            variant="h3"
            style={StyleSheet.flatten([styles.title, { color: feedbackColor }])}
          >
            {isCorrect ? "Correct!" : "Incorrect"}
          </Text>
        </View>
        <Text variant="body" style={styles.message}>
          {isCorrect ? "Great job!" : "Try again next time."}
        </Text>
      </Surface>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
  },
  correct: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderColor: "#4CAF50",
  },
  incorrect: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    borderColor: "#F44336",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  image: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
  title: {
    fontWeight: "bold",
    color: "#333",
  },
  message: {
    color: "#555",
  },
});

export default FeedbackCard;
