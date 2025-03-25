// app/screens/Home/ExerciseScreen.js
import React, { useEffect, useState, useContext, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Text, Button, RadioButton, Card } from "react-native-paper";
import { AuthContext } from "../../contexts/AuthContext";

export default function ExerciseScreen({ route, navigation }) {
  const { storyId } = route.params;
  const { unlockNextLevel } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const feedbackAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch(
        `https://hebrew-backend-8sozbbz4w-faeiz17s-projects.vercel.app/api/exercises/story/${storyId}`
      );
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  // When an option is selected, update the state and animate the feedback.
  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    setFeedbackVisible(true);
    Animated.timing(feedbackAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.options.find(
      (opt) => opt._id === selectedOption
    )?.isCorrect;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    // Reset for next question.
    setSelectedOption(null);
    setFeedbackVisible(false);
    feedbackAnim.setValue(0);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  if (currentQuestionIndex >= questions.length && questions.length > 0) {
    // Completed all questions
    return (
      <View style={styles.resultContainer}>
        <Text variant="titleLarge" style={styles.resultText}>
          You scored {score} out of {questions.length}!
        </Text>
        <Button
          mode="contained"
          style={styles.resultButton}
          onPress={() => {
            // Unlock the next level and navigate back
            unlockNextLevel();
            navigation.navigate("Levels");
          }}
        >
          Back to Levels
        </Button>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Generate immediate feedback text.
  const renderFeedback = () => {
    if (!feedbackVisible || selectedOption === null) return null;
    const chosen = currentQuestion.options.find(
      (opt) => opt._id === selectedOption
    );
    const isCorrect = chosen?.isCorrect;
    return (
      <Animated.Text
        style={[
          styles.feedbackText,
          { opacity: feedbackAnim, color: isCorrect ? "#4CAF50" : "#F44336" },
        ]}
      >
        {isCorrect ? "Correct!" : "Incorrect!"}
      </Animated.Text>
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.questionCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.questionText}>
            {currentQuestion.question}
          </Text>
          <RadioButton.Group
            onValueChange={handleOptionSelect}
            value={selectedOption}
          >
            {currentQuestion.options.map((opt) => (
              <RadioButton.Item
                key={opt._id}
                label={`${opt.hebrew} (${opt.english})`}
                value={opt._id}
                style={styles.radioItem}
              />
            ))}
          </RadioButton.Group>
          {renderFeedback()}
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        onPress={handleNext}
        style={styles.nextButton}
        disabled={selectedOption === null}
        contentStyle={styles.buttonContent}
      >
        Next
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#333",
  },
  questionCard: {
    marginBottom: 24,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: "#fff",
  },
  questionText: {
    marginBottom: 16,
    fontWeight: "bold",
    fontSize: 22,
  },
  radioItem: {
    marginVertical: 4,
  },
  feedbackText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: "#3b82f6",
    alignSelf: "center",
    width: "60%",
    color: "white",
  },
  buttonContent: {
    paddingVertical: 10,
    color: "white",
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultText: {
    marginBottom: 24,
    fontSize: 22,
  },
  resultButton: {
    backgroundColor: "#3b82f6",
  },
});
