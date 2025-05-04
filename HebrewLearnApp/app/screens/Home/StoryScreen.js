// app/screens/Home/StoryScreen.js
import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Animated, 
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Image
} from "react-native";
import { 
  Text, 
  Button, 
  ActivityIndicator, 
  Card, 
  IconButton,
  Surface,
  Badge,
  ProgressBar
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from 'expo-av';
import Tts from 'react-native-tts';
import * as Speech from 'expo-speech';

// Import assets
const patternBackground =  require("../../../assets/background-pattern.png");
const hoopoeTeacher = require("../../../assets/HoopoeFace.png");

export default function StoryScreen({ route, navigation }) {
  const { storyId, levelNumber, storyTitle } = route.params;
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [sound, setSound] = useState();
  const [playing, setPlaying] = useState(false);
  const [userProgress, setUserProgress] = useState({});

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleButtonAnim = useRef(new Animated.Value(0.95)).current;
  const hebrewTextRef = useRef();
  const transliterationTextRef = useRef();
  const englishTextRef = useRef();

  // Audio player refs
  const soundRef = useRef(null);
  const progressInterval = useRef(null);
  const setupSpeech = async () => {
    try {
      // Check if speech is available
      const isSpeechAvailable = await Speech.isSpeakingAsync();
      console.log('Speech is available:', isSpeechAvailable);
      
      // Get available voices (this will work on iOS but may not on Android)
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        console.log('Available voices:', voices);
        
        // Attempt to find a Hebrew voice if available
        const hebrewVoice = voices.find(voice => 
          voice.language && (voice.language.includes('he') || voice.language.includes('iw'))
        );
        
        if (hebrewVoice) {
          console.log('Found Hebrew voice:', hebrewVoice);
        }
      } catch (voiceError) {
        // Voice listing might not be supported on all platforms
        console.log('Could not list voices:', voiceError);
      }
    } catch (error) {
      console.log('Speech setup error:', error);
      // Don't throw, just log the error
    }
  };

  useEffect(() => {
    // Load user progress
    loadProgress();
    // Fetch story data
    fetchStory();
    // Set up Speech
    setupSpeech();
  
    // Cleanup on unmount
    return () => {
      // Stop any ongoing speech
      Speech.stop();
      
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);
  

  // Load user progress from AsyncStorage
  const loadProgress = async () => {
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

  // Update progress for this level
  const updateProgress = async () => {
    try {
      const updatedProgress = {...userProgress};
      
      // Initialize if this level doesn't exist yet
      if (!updatedProgress[levelNumber]) {
        updatedProgress[levelNumber] = {
          completed: false,
          percentage: 50, // Set to 50% after viewing the story
          points: 10,
          stars: 0,
          lastUpdated: new Date().toISOString()
        };
      } else {
        // Update existing progress
        updatedProgress[levelNumber] = {
          ...updatedProgress[levelNumber],
          percentage: Math.max(50, updatedProgress[levelNumber].percentage),
          points: Math.max(10, updatedProgress[levelNumber].points),
          lastUpdated: new Date().toISOString()
        };
      }
      
      // Save updated progress
      await AsyncStorage.setItem('userProgress', JSON.stringify(updatedProgress));
      setUserProgress(updatedProgress);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const fetchStory = async () => {
    try {
      const response = await fetch(
        `https://hebrew-backend-8sozbbz4w-faeiz17s-projects.vercel.app/api/stories/${storyId}`
      );
      const data = await response.json();
      setStory(data);
      
      // Update progress after story is loaded
      updateProgress();
      
      // Stagger animations after data is loaded
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 5,
          useNativeDriver: true,
        })
      ]).start();
      
      // Button pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleButtonAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleButtonAnim, {
            toValue: 0.95,
            duration: 800,
            useNativeDriver: true,
          })
        ])
      ).start();

      // Trigger text animations after a delay
      setTimeout(() => {
        if (hebrewTextRef.current) hebrewTextRef.current.animate('fadeInRight', 800);
        
        setTimeout(() => {
          if (transliterationTextRef.current) 
            transliterationTextRef.current.animate('fadeInRight', 800);
          
          setTimeout(() => {
            if (englishTextRef.current) englishTextRef.current.animate('fadeInRight', 800);
          }, 400);
        }, 400);
      }, 1000);
    } catch (error) {
      console.error("Error fetching story:", error);
    } finally {
      setLoading(false);
    }
  };

  // Audio playback functions
  const playPauseAudio = async () => {
    try {
      // Check if currently speaking
      const isSpeaking = await Speech.isSpeakingAsync();
      
      if (isSpeaking || playing) {
        // Stop speaking if already playing
        await Speech.stop();
        setPlaying(false);
        setProgress(0);
        
        // Clear any progress interval
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
          progressInterval.current = null;
        }
      } else {
        // Start speaking the transliteration text
        if (story?.transliteration) {
          // Animate texts while playing
          if (hebrewTextRef.current) hebrewTextRef.current.animate('pulse', 800);
          setTimeout(() => {
            if (transliterationTextRef.current) 
              transliterationTextRef.current.animate('pulse', 800);
          }, 1000);
          
          // Set playing state immediately for UI feedback
          setPlaying(true);
          
          // Start progress simulation
          let currentProgress = 0;
          progressInterval.current = setInterval(() => {
            currentProgress += 0.01;
            if (currentProgress >= 1) {
              clearInterval(progressInterval.current);
              progressInterval.current = null;
              setProgress(0);
              setPlaying(false);
            } else {
              setProgress(currentProgress);
            }
          }, 100);
          
          // Speak the transliteration text
          // Note: Speech.speak doesn't return a Promise in all versions
          Speech.speak(story.transliteration, {
            language: 'en-US', // Fallback to English as Hebrew might not be available
            pitch: 1.0,
            rate: 0.75, // Slower rate for better pronunciation
            onStart: () => {
              console.log('Speech started');
            },
            onDone: () => {
              console.log('Speech finished');
              setPlaying(false);
              setProgress(0);
              if (progressInterval.current) {
                clearInterval(progressInterval.current);
                progressInterval.current = null;
              }
            },
            onStopped: () => {
              console.log('Speech stopped');
              setPlaying(false);
              setProgress(0);
              if (progressInterval.current) {
                clearInterval(progressInterval.current);
                progressInterval.current = null;
              }
            },
            onError: (error) => {
              console.log('Speech error:', error);
              setPlaying(false);
              // Fall back to simulation if there's an error
              simulateAudioPlayback();
            },
          });
        }
      }
    } catch (error) {
      console.error('Speech error:', error);
      // Fall back to the simulation if there's an error
      simulateAudioPlayback();
    }
  };
  const simulateAudioPlayback = () => {
    setPlaying(true);
    setProgress(0);
    
    // Simulate audio progress
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) {
          clearInterval(progressInterval.current);
          setPlaying(false);
          return 0;
        }
        return prev + 0.01;
      });
    }, 100);
    
    // Animate texts while "playing"
    if (hebrewTextRef.current) hebrewTextRef.current.animate('pulse', 800);
    setTimeout(() => {
      if (transliterationTextRef.current) 
        transliterationTextRef.current.animate('pulse', 800);
    }, 1000);
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#41B2EB" />
        <Text style={styles.loadingText}>Loading story...</Text>
      </View>
    );
  }

  if (!story) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="bodyLarge" style={{ color: "red" }}>
          Failed to load story. Please try again.
        </Text>
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

  return (
    <ImageBackground 
      source={patternBackground} 
      style={styles.backgroundImage}
      imageStyle={styles.backgroundPattern}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Level Badge */}
        <Badge style={styles.levelBadge}>Level {levelNumber}</Badge>
        
        {/* Audio Player Card */}
        <Animatable.View 
          animation="fadeInDown"
          duration={800}
          delay={300}
        >
          <Surface style={styles.audioPlayerCard}>
            <View style={styles.audioPlayerHeader}>
              <Image 
                source={hoopoeTeacher} 
                style={styles.teacherImage} 
              />
              <View style={styles.audioTitleContainer}>
                <Text style={styles.audioTitle}>Listen & Learn</Text>
                <Text style={styles.audioSubtitle}>Tap to hear pronunciation</Text>
              </View>
            </View>
            
            <View style={styles.playerControls}>
              <TouchableOpacity 
                style={styles.playButton}
                onPress={playPauseAudio}
              >
                <LinearGradient
                  colors={["#41B2EB", "#007AFF"]}
                  style={styles.playButtonGradient}
                >
                  <IconButton 
                    icon={playing ? "pause" : "play"} 
                    color="#FFFFFF" 
                    size={30} 
                    style={styles.playIcon}
                  />
                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.progressBarContainer}>
                <ProgressBar
                  progress={progress}
                  color="#41B2EB"
                  style={styles.audioProgress}
                />
                <Text style={styles.progressText}>
                  {playing ? "Playing..." : "Tap play to listen"}
                </Text>
              </View>
            </View>
          </Surface>
        </Animatable.View>
        
        {/* Story Content Card */}
        <Animated.View
          style={[
            styles.animatedCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Surface style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Story Time</Text>
              <Badge style={styles.difficultyBadge}>
                {story.level || "beginner"}
              </Badge>
            </View>
            
            <View style={styles.cardContent}>
              {/* Hebrew Text */}
              <Animatable.View
                ref={hebrewTextRef}
                style={styles.textSection}
              >
                <View style={styles.textLabelContainer}>
                  <Badge style={styles.textLabel}>Hebrew</Badge>
                </View>
                <Text style={styles.hebrewText}>
                  {story.hebrew}
                </Text>
              </Animatable.View>
              
              {/* Transliteration */}
              <Animatable.View
                ref={transliterationTextRef}
                style={styles.textSection}
              >
                <View style={styles.textLabelContainer}>
                  <Badge style={[styles.textLabel, styles.transliterationLabel]}>
                    Pronunciation
                  </Badge>
                </View>
                <Text style={styles.transliterationText}>
                  {story.transliteration}
                </Text>
              </Animatable.View>
              
              {/* English Translation */}
              <Animatable.View
                ref={englishTextRef}
                style={styles.textSection}
              >
                <View style={styles.textLabelContainer}>
                  <Badge style={[styles.textLabel, styles.translationLabel]}>
                    Translation
                  </Badge>
                </View>
                <Text style={styles.translationText}>
                  {story.english}
                </Text>
              </Animatable.View>
            </View>
          </Surface>
        </Animated.View>

        {/* Exercise Button */}
        <Animated.View
          style={[
            styles.exerciseButtonContainer,
            { 
              opacity: fadeAnim, 
              transform: [
                { translateY: slideAnim },
                { scale: scaleButtonAnim }
              ] 
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Exercise", { 
              storyId,
              levelNumber,
              storyTitle: story.title || `Level ${levelNumber}`
            })}
          >
            <LinearGradient
              colors={["#DE8A2C", "#FF9800"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.exerciseButton}
            >
              <Text style={styles.exerciseButtonText}>Start Exercises</Text>
              <IconButton 
                icon="arrow-right" 
                color="#FFFFFF" 
                size={24} 
                style={styles.buttonIcon}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
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
    marginTop: 100,
    padding: 16,
    paddingBottom: 100,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorButton: {
    marginTop: 20,
    backgroundColor: "#41B2EB",
  },
  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#41B2EB',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  audioPlayerCard: {
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  audioPlayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teacherImage: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  audioTitleContainer: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  audioSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    marginRight: 12,
  },
  playButtonGradient: {
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    margin: 0,
  },
  progressBarContainer: {
    flex: 1,
  },
  audioProgress: {
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
  },
  animatedCard: {
    marginBottom: 24,
  },
  card: {
    borderRadius: 16,
    elevation: 4,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  difficultyBadge: {
    backgroundColor: '#4CAF50',
    color: 'white',
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 16,
  },
  textSection: {
    marginBottom: 20,
    position: 'relative',
    paddingTop: 12,
  },
  textLabelContainer: {
    position: 'absolute',
    top: -10,
    left: 10,
    zIndex: 1,
  },
  textLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  transliterationLabel: {
    backgroundColor: '#41B2EB',
  },
  translationLabel: {
    backgroundColor: '#DE8A2C',
  },
  hebrewText: {
    backgroundColor: 'rgba(245, 245, 245, 0.5)',
    padding: 16,
    borderRadius: 8,
    fontSize: 22,
    lineHeight: 30,
    textAlign: "right",
    fontWeight: "bold",
    color: '#333',
  },
  transliterationText: {
    backgroundColor: 'rgba(230, 240, 255, 0.5)',
    padding: 16,
    borderRadius: 8,
    fontSize: 18,
    lineHeight: 26,
    fontStyle: "italic",
    color: '#0066CC',
  },
  translationText: {
    backgroundColor: 'rgba(255, 240, 230, 0.5)',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  exerciseButtonContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  exerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: width * 0.8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  exerciseButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    margin: 0,
  },
});