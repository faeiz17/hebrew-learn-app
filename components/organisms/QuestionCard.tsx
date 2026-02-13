import { View, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import { Surface, Badge, ProgressBar } from "react-native-paper";

import { Text } from "@/atoms";
import { OptionItem, FeedbackCard } from "@/molecules";
import { Exercise, Option } from "@/types";

interface QuestionCardProps {
  questionIndex: number;
  totalQuestions: number;
  exercise: Exercise;
  selectedOptionId: string | null;
  isCorrect?: boolean;
  showFeedback: boolean;
  onOptionSelect: (id: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questionIndex,
  totalQuestions,
  exercise,
  selectedOptionId,
  isCorrect,
  showFeedback,
  onOptionSelect,
}) => {
  return (
    <Animatable.View animation="fadeIn" duration={500} style={styles.container}>
      <View style={styles.progressContainer}>
        <Text variant="caption" style={styles.progressText}>
          Question {questionIndex + 1} of {totalQuestions}
        </Text>
        <ProgressBar
          progress={questionIndex / totalQuestions}
          color="#41B2EB"
          style={styles.progressBar}
        />
      </View>

      <Surface style={styles.card}>
        <View style={styles.header}>
          {/* Difficulty removed as it is not in Exercise type */}
        </View>
        <Text variant="h2" style={styles.questionText}>
          {exercise.question}
        </Text>

        <View style={styles.optionsContainer}>
          {exercise.options.map((option) => (
            <OptionItem
              key={option._id}
              id={option._id}
              hebrew={option.hebrew}
              english={option.english}
              isSelected={selectedOptionId === option._id}
              isCorrect={option.isCorrect}
              showFeedback={showFeedback}
              onSelect={onOptionSelect}
            />
          ))}
        </View>

        <FeedbackCard isVisible={showFeedback} isCorrect={!!isCorrect} />
      </Surface>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    color: "#666",
    marginBottom: 6,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    backgroundColor: "#FFFFFF",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#41B2EB",
    color: "white",
    fontWeight: "bold",
  },
  questionText: {
    fontWeight: "bold",
    color: "#333",
    marginTop: 18,
    paddingRight: 40,
  },
  optionsContainer: {
    padding: 16,
  },
});

export default QuestionCard;
