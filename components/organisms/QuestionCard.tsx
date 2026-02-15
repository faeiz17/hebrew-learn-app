import React from "react";
import { View, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import { Surface, ProgressBar } from "react-native-paper";

import { Text } from "@/atoms";
import { OptionItem, FeedbackCard } from "@/molecules";
import { Exercise } from "@/types";
import { useTheme } from "@/utils/theme-engine";
import useColors from "@/hooks/useColors";

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
  const { theme } = useTheme();
  const colors = useColors();

  return (
    <Animatable.View animation="fadeIn" duration={500} style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text variant="caption" style={[theme.styles.labelS, styles.progressText]}>
            Step {questionIndex + 1} of {totalQuestions}
          </Text>
          <Text variant="caption" style={[theme.styles.labelS, styles.percentageText]}>
            {Math.round(((questionIndex + 1) / totalQuestions) * 100)}%
          </Text>
        </View>
        <ProgressBar
          progress={(questionIndex + 1) / totalQuestions}
          color={colors.blue6 as string}
          style={[styles.progressBar, { backgroundColor: "rgba(255, 255, 255, 0.2)" }]}
        />
      </View>

      <Surface style={[styles.card, theme.styles.cardShadow, { borderRadius: theme.radius[300] }]}>
        <View style={styles.cardHeader}>
          <Text variant="h2" style={[theme.styles.headingM, styles.questionText]}>
            {exercise.question}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {exercise.options.map((option, index) => (
            <Animatable.View
              key={option._id}
              animation="fadeInUp"
              delay={200 + index * 100}
            >
              <OptionItem
                id={option._id}
                hebrew={option.hebrew}
                english={option.english}
                isSelected={selectedOptionId === option._id}
                isCorrect={option.isCorrect}
                showFeedback={showFeedback}
                onSelect={onOptionSelect}
              />
            </Animatable.View>
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
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  percentageText: {
    color: "#FFFFFF",
    opacity: 0.8,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  card: {
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  cardHeader: {
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  questionText: {
    textAlign: "center",
    lineHeight: 32,
    color: "#333",
  },
  optionsContainer: {
    padding: 16,
    gap: 12,
  },
});

export default QuestionCard;
