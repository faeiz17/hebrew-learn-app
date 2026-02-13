import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Animatable from "react-native-animatable";

import { Images } from "@/assets/images";
import { Text, Button } from "@/atoms";
import { QuestionCard } from "@/organisms";
import { Exercise } from "@/types";

// Assets

interface ExerciseTemplateProps {
  isLoading: boolean;
  error: Error | null;
  exercises: Exercise[] | undefined;
  currentQuestionIndex: number;
  selectedOption: string | null;
  isCorrect?: boolean;
  showFeedback: boolean;
  onOptionSelect: (id: string) => void;
  onNext: () => void;
  onGoBack: () => void;
}
const patternBackground = Images.BackgroundPattern;

const ExerciseTemplate: React.FC<ExerciseTemplateProps> = ({
  isLoading,
  error,
  exercises,
  currentQuestionIndex,
  selectedOption,
  isCorrect,
  showFeedback,
  onOptionSelect,
  onNext,
  onGoBack,
}) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#41B2EB" />
        <Text style={{ marginTop: 10 }}>Loading exercises...</Text>
      </View>
    );
  }

  if (error || !exercises || exercises.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading exercises or no exercises found.</Text>
        <Button onPress={onGoBack} style={{ marginTop: 20 }}>
          Go Back
        </Button>
      </View>
    );
  }

  const currentQuestion = exercises[currentQuestionIndex];

  return (
    <ImageBackground
      source={patternBackground}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundPattern}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <QuestionCard
          questionIndex={currentQuestionIndex}
          totalQuestions={exercises.length}
          exercise={currentQuestion}
          selectedOptionId={selectedOption}
          isCorrect={isCorrect}
          showFeedback={showFeedback}
          onOptionSelect={onOptionSelect}
        />

        <Animatable.View
          animation={showFeedback ? "bounceIn" : "fadeOut"}
          duration={500}
          style={styles.nextButtonContainer}
        >
          <Button
            mode="contained"
            onPress={onNext}
            disabled={!selectedOption}
            contentStyle={{ paddingVertical: 8 }}
          >
            {currentQuestionIndex < exercises.length - 1
              ? "Next Question"
              : "Finish"}
          </Button>
        </Animatable.View>
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
    padding: 16,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  nextButtonContainer: {
    marginTop: 20,
    width: "100%",
  },
});

export default ExerciseTemplate;
