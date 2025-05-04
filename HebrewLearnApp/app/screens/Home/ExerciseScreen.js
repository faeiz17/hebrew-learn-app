// app/screens/Home/ExerciseScreen.js
import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import {
  Text,
  Button,
  RadioButton,
  Card,
  Surface,
  IconButton,
  Badge,
  ProgressBar,
  ActivityIndicator
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "../../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Confetti from 'react-native-confetti';
import LottieView from 'lottie-react-native';

// Assets
const patternBackground = require("../../../assets/background-pattern.png");
const hoopoeHappy = require("../../../assets/HoopoeFace.png");
const hoopoeSad = require("../../../assets/HoopoeFaceLocked.png"); // Use for incorrect answers

export default function ExerciseScreen({ route, navigation }) {
  const { storyId, levelNumber, storyTitle } = route.params;
  const { unlockNextLevel } = useContext(AuthContext);
  
  // State variables
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [userProgress, setUserProgress] = useState({});
  const [earnedStars, setEarnedStars] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Animation refs
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const questionScaleAnim = useRef(new Animated.Value(0.95)).current;
  const confettiRef = useRef(null);
  const lottieRef = useRef(null);
  const optionsRefs = useRef([]);
  
  // Progress tracking
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const [correctOnFirstTry, setCorrectOnFirstTry] = useState(0);
  
  useEffect(() => {
    fetchExercises();
    loadUserProgress();
    
    // Animate the question card
    Animated.spring(questionScaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
    
    return () => {
      // Cleanup
      if (confettiRef.current) {
        confettiRef.current.stopConfetti();
      }
    };
  }, []);
  
  // Load user progress from AsyncStorage
  const loadUserProgress = async () => {
    try {
      const progressData = await AsyncStorage.getItem('userProgress');
      if (progressData) {
        const parsed = JSON.parse(progressData);
        setUserProgress(parsed);
      }
    } catch (error) {
      console.error("Error loading user progress:", error);
    }
  };
  
  // Calculate stars and points based on performance
  const calculateRewards = () => {
    // Calculate stars (max 3)
    // 1 star: completed
    // 2 stars: >70% correct
    // 3 stars: 100% correct
    let stars = 1; // At least 1 star for completing
    
    const percentage = (score / questions.length) * 100;
    if (percentage >= 70) stars = 2;
    if (percentage === 100) stars = 3;
    
    // Calculate points
    // Base points: 50 for completing
    // Bonus for each correct answer: 10 points
    // Bonus for correct on first try: 5 points each
    const basePoints = 50;
    const correctAnswerPoints = score * 10;
    const firstTryBonus = correctOnFirstTry * 5;
    
    const totalPoints = basePoints + correctAnswerPoints + firstTryBonus;
    
    return { stars, points: totalPoints };
  };
  
  // Update user progress in AsyncStorage
  const updateProgress = async () => {
    try {
      const { stars, points } = calculateRewards();
      setEarnedStars(stars);
      setEarnedPoints(points);
      
      const updatedProgress = {...userProgress};
      
      // Update or initialize progress for this level
      updatedProgress[levelNumber] = {
        completed: true,
        percentage: 100,
        stars: stars,
        points: points,
        correctAnswers: score,
        totalQuestions: questions.length,
        lastUpdated: new Date().toISOString()
      };
      
      // Save updated progress
      await AsyncStorage.setItem('userProgress', JSON.stringify(updatedProgress));
      
      // Mark this level as completed for the results screen
      await AsyncStorage.setItem('lastCompletedLevel', levelNumber.toString());
      
      // Unlock next level
      unlockNextLevel();
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://hebrew-backend-8sozbbz4w-faeiz17s-projects.vercel.app/api/exercises/story/${storyId}`
      );
      const data = await response.json();
      
      // Initialize refs array for animations
      optionsRefs.current = data.reduce((acc, _, i) => {
        const options = Array(4).fill().map(() => React.createRef());
        acc[i] = options;
        return acc;
      }, {});
      
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  // When an option is selected
  const handleOptionSelect = (optionId) => {
    setAttemptedQuestions(prev => prev + 1);
    setSelectedOption(optionId);
    
    // Check if the answer is correct
    const currentQuestion = questions[currentQuestionIndex];
    const chosenOption = currentQuestion.options.find(opt => opt._id === optionId);
    const correct = chosenOption?.isCorrect || false;
    
    setIsCorrect(correct);
    setFeedbackVisible(true);
    
    // If correct on first try, increment the counter
    if (correct && !feedbackVisible) {
      setCorrectOnFirstTry(prev => prev + 1);
    }
    
    // Animate feedback
    Animated.timing(feedbackAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    // Animate the selected option
    const questionIdx = currentQuestionIndex;
    const optionIdx = currentQuestion.options.findIndex(opt => opt._id === optionId);
    
    if (optionsRefs.current[questionIdx] && optionsRefs.current[questionIdx][optionIdx]) {
      const animation = correct ? 'pulse' : 'shake';
      optionsRefs.current[questionIdx][optionIdx].animate(animation, 800);
    }
    
    // Play lottie animation if correct
    if (correct && lottieRef.current) {
      lottieRef.current.play();
    }
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.options.find(
      (opt) => opt._id === selectedOption
    )?.isCorrect;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    
    // Reset for next question
    setSelectedOption(null);
    setFeedbackVisible(false);
    feedbackAnim.setValue(0);
    
    // If this was the last question, show results
    if (currentQuestionIndex >= questions.length - 1) {
      updateProgress().then(() => {
        setShowResults(true);
        
        // Start confetti after a delay
        setTimeout(() => {
          if (confettiRef.current) {
            confettiRef.current.startConfetti();
          }
        }, 500);
      });
    } else {
      // Move to next question with animation
      Animated.sequence([
        Animated.timing(questionScaleAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(questionScaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
      
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#41B2EB" />
        <Text style={styles.loadingText}>Loading exercises...</Text>
      </View>
    );
  }

  // Render results screen
  if (showResults) {
    return (
      <ImageBackground 
        source={patternBackground} 
        style={styles.backgroundImage}
        imageStyle={styles.backgroundPattern}
      >
        <Confetti ref={confettiRef} />
        
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <Animatable.View 
            animation="bounceIn" 
            duration={1200}
            style={styles.resultsHeader}
          >
            <LinearGradient
              colors={["#41B2EB", "#007AFF"]}
              style={styles.resultsGradient}
            >
              <Image 
                source={hoopoeHappy} 
                style={styles.resultsMascot} 
              />
              <Text style={styles.congratsText}>Great Job!</Text>
              <Text style={styles.completedText}>Level {levelNumber} Completed</Text>
            </LinearGradient>
          </Animatable.View>
          
          <Animatable.View 
            animation="fadeInUp" 
            delay={300}
            duration={800}
            style={styles.scoreCardContainer}
          >
            <Surface style={styles.scoreCard}>
              <View style={styles.scoreHeader}>
                <Text style={styles.scoreTitle}>Your Score</Text>
                <Badge style={styles.scoreBadge}>{score}/{questions.length}</Badge>
              </View>
              
              <View style={styles.scoreContent}>
                <ProgressBar
                  progress={score / questions.length}
                  color="#41B2EB"
                  style={styles.scoreProgress}
                />
                
                <Text style={styles.scorePercentage}>
                  {Math.round((score / questions.length) * 100)}% Correct
                </Text>
                
                {/* Stars earned */}
                <View style={styles.starsContainer}>
                  <Text style={styles.starsLabel}>Stars Earned:</Text>
                  <View style={styles.starsRow}>
                    {[1, 2, 3].map((star) => (
                      <IconButton
                        key={star}
                        icon={star <= earnedStars ? "star" : "star-outline"}
                        size={36}
                        color={star <= earnedStars ? "#FFD700" : "#D3D3D3"}
                        style={styles.resultStar}
                      />
                    ))}
                  </View>
                </View>
                
                {/* Points earned */}
                <View style={styles.pointsContainer}>
                  <View style={styles.pointsIconContainer}>
                    <IconButton
                      icon="trophy"
                      size={30}
                      color="#FFD700"
                      style={styles.pointsIcon}
                    />
                  </View>
                  <View style={styles.pointsTextContainer}>
                    <Text style={styles.pointsValue}>{earnedPoints}</Text>
                    <Text style={styles.pointsLabel}>Points Earned</Text>
                  </View>
                </View>
              </View>
            </Surface>
          </Animatable.View>
          
          <Animatable.View 
            animation="fadeInUp" 
            delay={600}
            duration={800}
            style={styles.buttonContainer}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Levels" }],
                });
              }}
            >
              <LinearGradient
                colors={["#41B2EB", "#007AFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButton}
              >
                <Text style={styles.continueButtonText}>Continue Learning</Text>
                <IconButton 
                  icon="home" 
                  color="#FFFFFF" 
                  size={24} 
                  style={styles.buttonIcon}
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>
      </ImageBackground>
    );
  }

  // No questions available
  if (questions.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No exercises available for this story.</Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={styles.errorButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  // Main Exercise Screen
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <ImageBackground 
      source={patternBackground} 
      style={styles.backgroundImage}
      imageStyle={styles.backgroundPattern}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <ProgressBar
            progress={(currentQuestionIndex) / questions.length}
            color="#41B2EB"
            style={styles.progressBar}
          />
        </View>
        
        {/* Question card */}
        <Animated.View
          style={[
            styles.questionCardContainer,
            {
              transform: [{ scale: questionScaleAnim }]
            }
          ]}
        >
          <Surface style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <Badge style={styles.questionBadge}>Question {currentQuestionIndex + 1}</Badge>
              <Text style={styles.questionText}>{currentQuestion.question}</Text>
            </View>
            
            <View style={styles.optionsContainer}>
              <RadioButton.Group
                onValueChange={handleOptionSelect}
                value={selectedOption}
              >
                {currentQuestion.options.map((opt, idx) => (
                  <Animatable.View
                    key={opt._id}
                    ref={ref => {
                      if (optionsRefs.current[currentQuestionIndex]) {
                        optionsRefs.current[currentQuestionIndex][idx] = ref;
                      }
                    }}
                    animation="fadeInUp"
                    delay={300 + (idx * 100)}
                    duration={500}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleOptionSelect(opt._id)}
                      disabled={feedbackVisible}
                    >
                      <Surface 
                        style={[
                          styles.optionItem,
                          selectedOption === opt._id && styles.selectedOption,
                          feedbackVisible && selectedOption === opt._id && 
                            (isCorrect ? styles.correctOption : styles.incorrectOption)
                        ]}
                      >
                        <View style={styles.radioContainer}>
                          <RadioButton.Android
                            value={opt._id}
                            color={
                              feedbackVisible && selectedOption === opt._id
                                ? (isCorrect ? "#4CAF50" : "#F44336")
                                : "#41B2EB"
                            }
                            status={selectedOption === opt._id ? 'checked' : 'unchecked'}
                          />
                        </View>
                        
                        <View style={styles.optionTextContainer}>
                          <Text style={styles.hebrewOptionText}>{opt.hebrew}</Text>
                          <Text style={styles.englishOptionText}>({opt.english})</Text>
                        </View>
                      </Surface>
                    </TouchableOpacity>
                  </Animatable.View>
                ))}
              </RadioButton.Group>
            </View>
            
            {/* Feedback section */}
            {feedbackVisible && (
              <Animated.View
                style={[
                  styles.feedbackContainer,
                  { opacity: feedbackAnim }
                ]}
              >
                <Surface style={[
                  styles.feedbackCard,
                  isCorrect ? styles.correctFeedback : styles.incorrectFeedback
                ]}>
                  <View style={styles.feedbackHeader}>
                    <Image 
                      source={isCorrect ? hoopoeHappy : hoopoeSad}
                      style={styles.feedbackImage}
                    />
                    <Text style={styles.feedbackHeaderText}>
                      {isCorrect ? "Correct!" : "Incorrect!"}
                    </Text>
                  </View>
                  
                  <Text style={styles.feedbackText}>
                    {isCorrect 
                      ? "Great job! You chose the right answer." 
                      : "Not quite. Try to remember the correct meaning."}
                  </Text>
                </Surface>
                
                {/* Lottie animation for correct answers */}
                {/* {isCorrect && (
                  <View style={styles.lottieContainer}>
                    <LottieView
                      ref={lottieRef}
                      source={require('../../../assets/correct-animation.json')} // You'll need this animation file
                      autoPlay={false}
                      loop={false}
                      style={styles.lottieAnimation}
                    />
                  </View>
                )} */}
              </Animated.View>
            )}
          </Surface>
        </Animated.View>
        
        {/* Next button */}
        <Animatable.View
          animation={feedbackVisible ? "bounceIn" : "fadeOut"}
          duration={500}
          style={styles.nextButtonContainer}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleNext}
            disabled={!selectedOption}
          >
            <LinearGradient
              colors={isCorrect ? ["#4CAF50", "#2E7D32"] : ["#FF9800", "#F57C00"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButton}
            >
              <Text style={styles.nextButtonText}>
                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
              </Text>
              <IconButton 
                icon="arrow-right" 
                color="#FFFFFF" 
                size={24} 
                style={styles.buttonIcon}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  backgroundPattern: {
    opacity: 0.05,
  },
  container: {
    marginTop:100,
    alignContent:"center",
    padding: 16,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: "#41B2EB",
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  questionCardContainer: {
    marginBottom: 20,
  },
  questionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  questionHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  questionBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#41B2EB',
    color: 'white',
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#333',
    marginBottom: 8,
    marginTop: 8,
    paddingRight: 40,
  },
  optionsContainer: {
    padding: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#FFFFFF',
  },
  selectedOption: {
    borderColor: '#41B2EB',
    backgroundColor: 'rgba(65, 178, 235, 0.1)',
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  incorrectOption: {
    borderColor: '#F44336',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  radioContainer: {
    marginRight: 8,
  },
  optionTextContainer: {
    flex: 1,
  },
  hebrewOptionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  englishOptionText: {
    fontSize: 14,
    color: '#666',
  },
  feedbackContainer: {
    padding: 16,
    paddingTop: 0,
  },
  feedbackCard: {
    padding: 16,
    borderRadius: 12,
  },
  correctFeedback: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  incorrectFeedback: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackImage: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
  feedbackHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  feedbackText: {
    fontSize: 16,
    color: '#555',
  },
  lottieContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  nextButtonContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    minWidth: width * 0.7,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    margin: 0,
  },
  // Results screen styles
  resultsContainer: {
    padding: 16,
    paddingBottom: 30,
    alignItems: 'center',
  },
  resultsHeader: {
    width: '100%',
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  resultsGradient: {
    padding: 24,
    alignItems: 'center',
  },
  resultsMascot: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  congratsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  completedText: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  scoreCardContainer: {
    width: '100%',
    marginBottom: 24,
  },
  scoreCard: {
    borderRadius: 16,
    elevation: 4,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scoreTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreBadge: {
    backgroundColor: '#41B2EB',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreContent: {
    padding: 16,
  },
  scoreProgress: {
    height: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
  scorePercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  starsContainer: {
    marginBottom: 20,
  },
  starsLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resultStar: {
    margin: 0,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(65, 178, 235, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  pointsIconContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 30,
    marginRight: 16,
  },
  pointsIcon: {
    margin: 0,
  },
  pointsTextContainer: {
    flex: 1,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pointsLabel: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    minWidth: width * 0.8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});