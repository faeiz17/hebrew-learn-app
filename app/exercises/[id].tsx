import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";

import { useFetchExercises } from "@/hooks/Exercises/useFetchExercises";
import { ExerciseTemplate } from "@/templates";

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const storyId = Array.isArray(id) ? id[0] : id;

  const {
    data: exercises,
    isLoading,
    error,
  } = useFetchExercises(storyId || "");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);

    if (!exercises) return;
    const currentQuestion = exercises[currentQuestionIndex];
    const option = currentQuestion.options.find((opt) => opt._id === optionId);

    if (option) {
      setIsCorrect(option.isCorrect);
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    if (!exercises) return;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(undefined);
      setShowFeedback(false);
    } else {
      alert(
        `Quiz Complete! Score: ${score + (isCorrect ? 1 : 0)}/${exercises.length}`,
      );
      router.back();
    }
  };

  return (
    <ExerciseTemplate
      isLoading={isLoading}
      error={error}
      exercises={exercises}
      currentQuestionIndex={currentQuestionIndex}
      selectedOption={selectedOption}
      isCorrect={isCorrect}
      showFeedback={showFeedback}
      onOptionSelect={handleOptionSelect}
      onNext={handleNext}
      onGoBack={() => router.back()}
    />
  );
}
