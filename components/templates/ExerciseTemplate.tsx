import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";

import { Images } from "@/assets/images";
import { Text, Button } from "@/atoms";
import { TopBar } from "@/molecules";
import { QuestionCard } from "@/organisms";
import { Exercise } from "@/types";
import { useTheme } from "@/utils/theme-engine";
import useColors from "@/hooks/useColors";

const { height } = Dimensions.get("window");

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
  const { theme } = useTheme();
  const colors = useColors();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue6 as string} />
        <Text style={{ marginTop: 10 }}>Preparing your practice...</Text>
      </View>
    );
  }

  if (error || !exercises || exercises.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="h2">Oops!</Text>
        <Text style={{ marginTop: 8, textAlign: 'center' }}>
          We couldn't load the exercises for this story.
        </Text>
        <Button
          mode="contained"
          onPress={onGoBack}
          style={[styles.backButton, { backgroundColor: colors.blue6 as string }]}
        >
          Return to Lessons
        </Button>
      </View>
    );
  }

  const currentQuestion = exercises[currentQuestionIndex];

  return (
    <View style={styles.root}>
      <TopBar
        title="Practice"
        showBack
        onBack={onGoBack}
        style={styles.absoluteHeader}
        titleColor="#FFFFFF"
        iconColor="#FFFFFF"
        hideShadow
      />

      <LinearGradient
        colors={[colors.blue6 as string, colors.blue7 as string]}
        style={StyleSheet.absoluteFill}
      />

      <ImageBackground
        source={Images.BackgroundPattern}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundPattern}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
            animation={selectedOption ? "bounceIn" : "fadeOut"}
            duration={500}
            style={styles.nextButtonContainer}
          >
            <Button
              mode="contained"
              onPress={onNext}
              disabled={!selectedOption}
              style={[styles.nextButton, { backgroundColor: colors.amber6 as string }]}
              labelStyle={styles.nextButtonLabel}
            >
              {currentQuestionIndex < exercises.length - 1
                ? "Next Question"
                : "Complete Exercise"}
            </Button>
          </Animatable.View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  absoluteHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "transparent",
    borderBottomWidth: 0,
  },
  backgroundImage: {
    flex: 1,
  },
  backgroundPattern: {
    opacity: 0.1,
    tintColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: height * 0.14,
    paddingBottom: 40,
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
    padding: 40,
  },
  backButton: {
    marginTop: 24,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  nextButtonContainer: {
    marginTop: 24,
    width: "100%",
  },
  nextButton: {
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  nextButtonLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default ExerciseTemplate;
