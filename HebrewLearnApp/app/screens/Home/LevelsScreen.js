import React, { useEffect, useState, useContext, useRef } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import {
  Text,
  Button,
  ActivityIndicator,
  Card,
  Badge,
  ProgressBar,
  IconButton,
  Surface,
} from "react-native-paper";
import { AuthContext } from "../../contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import assets
const hoopoeFace = require("../../../assets/HoopoeFace.png");
const hoopoeFaceGray = require("../../../assets/HoopoeFaceLocked.png");
const hoopoeBanner = require("../../../assets/HoopoeBanner.png");
const backgroundPattern = require("../../../assets/background-pattern.png"); // You'd need to add this asset

export default function LevelsScreen({ navigation }) {
  const { user, unlockedLevel, setUnlockedLevel } = useContext(AuthContext);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // For confetti animation on level complete
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Banner parallax effect calculation
  const bannerHeight = 200;
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, bannerHeight],
    outputRange: [0, -bannerHeight / 2],
    extrapolate: 'clamp',
  });
  
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, bannerHeight / 2, bannerHeight],
    outputRange: [1, 0.8, 0.6],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    // Check if we're coming from a completed level
    const checkForLevelCompletion = async () => {
      try {
        const completedLevel = await AsyncStorage.getItem('lastCompletedLevel');
        if (completedLevel) {
          setShowConfetti(true);
          setTimeout(() => {
            setShowConfetti(false);
          }, 3000);
          await AsyncStorage.removeItem('lastCompletedLevel');
        }
      } catch (error) {
        console.error("Error checking level completion:", error);
      }
    };
    
    checkForLevelCompletion();
    fetchAllStories();
    loadUserProgress();
  }, []);

  // Load user progress from AsyncStorage
  const loadUserProgress = async () => {
    try {
      const progressData = await AsyncStorage.getItem('userProgress');
      if (progressData) {
        const parsed = JSON.parse(progressData);
        setUserProgress(parsed);
        
        // Calculate totals
        let points = 0;
        let stars = 0;
        
        Object.values(parsed).forEach(level => {
          points += level.points || 0;
          stars += level.stars || 0;
        });
        
        setTotalPoints(points);
        setTotalStars(stars);
      } else {
        // Initialize with empty progress if none exists
        setUserProgress({});
        setTotalPoints(0);
        setTotalStars(0);
      }
    } catch (error) {
      console.error("Error loading user progress:", error);
    }
  };

  const fetchAllStories = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://hebrew-backend-44h3.vercel.app/api/stories"
      );
      const data = await response.json();
      const sorted = sortStoriesByDifficulty(data);
      setStories(sorted);
      
      // Start animation once data is loaded
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortStoriesByDifficulty = (storiesArray) => {
    const priority = { easy: 1, medium: 2, hard: 3 };
    return storiesArray
      .slice()
      .sort((a, b) => priority[a.level] - priority[b.level]);
  };

  const handleLevelPress = (story, index) => {
    const levelNumber = index + 1;
    if (levelNumber <= unlockedLevel) {
      navigation.navigate("Story", { 
        storyId: story._id,
        levelNumber: levelNumber,
        storyTitle: story.title || `Level ${levelNumber}`,
      });
    } else {
      // Enhanced feedback for locked levels
      showLockedLevelFeedback(levelNumber);
    }
  };
  
  const showLockedLevelFeedback = (levelNumber) => {
    // Calculate previous level progress needed
    const prevLevel = levelNumber - 1;
    const prevProgress = userProgress[prevLevel] || { completed: false, percentage: 0 };
    
    let message = `This level is locked. Complete Level ${prevLevel} first!`;
    
    if (prevProgress.percentage > 0 && prevProgress.percentage < 100) {
      message += `\n\nYou've made ${prevProgress.percentage}% progress on Level ${prevLevel}.`;
    }
    
    alert(message);
  };

  // Calculate level completion status and color
  const getLevelCompletionInfo = (levelIndex) => {
    const levelNumber = levelIndex + 1;
    const progress = userProgress[levelNumber] || { completed: false, percentage: 0, stars: 0 };
    
    let statusText = "Not Started";
    let statusColor = "#aaaaaa";
    let progressPercentage = progress.percentage || 0;
    
    if (progress.completed) {
      statusText = "Completed";
      statusColor = "#4CAF50";
      progressPercentage = 100;
    } else if (progressPercentage > 0) {
      statusText = `${progressPercentage}% Complete`;
      statusColor = "#FF9800";
    }
    
    return { 
      text: statusText, 
      color: statusColor, 
      progress: progressPercentage / 100,
      stars: progress.stars || 0
    };
  };

  // Render stars based on level performance
  const renderStars = (count) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3].map((star) => (
          <IconButton
            key={star}
            icon={star <= count ? "star" : "star-outline"}
            size={18}
            color={star <= count ? "#FFD700" : "#D3D3D3"}
            style={styles.starIcon}
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#41B2EB" />
        <Text style={{ marginTop: 8 }}>Loading your adventures...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* Confetti overlay if level was just completed */}
      {showConfetti && (
        <Animatable.View 
          animation="fadeOut" 
          duration={2500}
          style={styles.confettiContainer}
        >
          {/* Add confetti particles here */}
          <Text style={styles.congratsText}>
            Level Complete!
          </Text>
        </Animatable.View>
      )}
      
      <Animated.ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Animated Banner with Parallax effect */}
        <Animated.View 
          style={[
            styles.bannerContainer,
            { transform: [{ translateY: headerTranslateY }] }
          ]}
        >
          <LinearGradient
            colors={["#41B2EB", "#007AFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.banner}
          >
            <Animated.Image 
              source={hoopoeBanner} 
              style={[styles.bannerImage, { opacity: imageOpacity }]} 
            />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Hebrew Adventures</Text>
              <Text style={styles.bannerSubtitle}>
                Complete levels to earn points & stars
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
        
        {/* Stats Cards Row */}
        <Animatable.View 
          animation="fadeInUp" 
          delay={300} 
          duration={800} 
          style={styles.statsContainer}
        >
          <Surface style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <IconButton 
                icon="star" 
                size={24} 
                color="#FFD700" 
                style={styles.statIcon} 
              />
            </View>
            <Text style={styles.statValue}>{totalStars}</Text>
            <Text style={styles.statLabel}>Stars</Text>
          </Surface>
          
          <Surface style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <IconButton 
                icon="trophy" 
                size={24} 
                color="#FF9800" 
                style={styles.statIcon} 
              />
            </View>
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </Surface>
          
          <Surface style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <IconButton 
                icon="book-open-variant" 
                size={24} 
                color="#4CAF50" 
                style={styles.statIcon} 
              />
            </View>
            <Text style={styles.statValue}>{unlockedLevel}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </Surface>
        </Animatable.View>

        {/* Levels Section */}
        <View style={styles.levelsSectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Story Levels</Text>
            <Badge style={styles.levelBadge}>{stories.length}</Badge>
          </View>
          
          <Animated.View style={{ opacity: fadeAnim }}>
            {stories.map((story, index) => {
              const levelNumber = index + 1;
              const isUnlocked = levelNumber <= unlockedLevel;
              const completion = getLevelCompletionInfo(index);
              
              return (
                <Animatable.View
                  key={story._id}
                  animation="fadeInUp"
                  delay={400 + (index * 100)}
                  duration={800}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleLevelPress(story, index)}
                    disabled={!isUnlocked}
                  >
                    <Surface style={[styles.card, !isUnlocked && styles.lockedCard]}>
                      {/* Level difficulty badge */}
                      <Badge 
                        style={[
                          styles.difficultyBadge, 
                          { 
                            backgroundColor: 
                              story.level === 'easy' ? '#4CAF50' : 
                              story.level === 'medium' ? '#FF9800' : '#F44336' 
                          }
                        ]}
                      >
                        {story.level}
                      </Badge>
                      
                      <View style={styles.cardHeader}>
                        <Image
                          source={isUnlocked ? hoopoeFace : hoopoeFaceGray}
                          style={styles.avatar}
                        />
                        <View style={styles.levelInfo}>
                          <Text style={styles.levelTitle}>Level {levelNumber}</Text>
                          
                          {/* Render stars for completed levels */}
                          {isUnlocked && renderStars(completion.stars)}
                          
                          {/* Story preview */}
                          <Text style={styles.previewText} numberOfLines={2}>
                            {story.hebrew.slice(0, 50)}...
                          </Text>
                          
                          {/* Progress bar */}
                          <View style={styles.progressContainer}>
                            <ProgressBar 
                              progress={completion.progress} 
                              color={completion.color}
                              style={styles.progressBar} 
                            />
                            <Text style={[styles.statusText, { color: completion.color }]}>
                              {completion.text}
                            </Text>
                          </View>
                        </View>
                      </View>
                      
                      <View style={styles.cardFooter}>
                        <LinearGradient
                          colors={isUnlocked ? ["#41B2EB", "#007AFF"] : ["#aaaaaa", "#777777"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.buttonGradient}
                        >
                          <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}>
                              {isUnlocked ? "Start Level" : "Locked"}
                            </Text>
                            <IconButton 
                              icon={isUnlocked ? "arrow-right" : "lock"} 
                              color="#FFFFFF" 
                              size={20} 
                              style={styles.buttonIcon}
                            />
                          </View>
                        </LinearGradient>
                      </View>
                    </Surface>
                  </TouchableOpacity>
                </Animatable.View>
              );
            })}
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 60,
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  congratsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  bannerContainer: {
    height: 200,
    width: '100%',
    overflow: 'hidden',
  },
  banner: {
    height: '100%',
    justifyContent: 'flex-end',
    padding: 20,
    overflow: 'hidden',
  },
  bannerImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    position: 'absolute',
    right: 20,
    bottom: 10,
  },
  bannerTextContainer: {
    maxWidth: '70%',
    marginBottom: 10,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginTop: -30,
    zIndex: 10,
  },
  statCard: {
    width: (width - 56) / 3,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statIconContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    marginBottom: 5,
  },
  statIcon: {
    margin: 0,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  levelsSectionContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#41B2EB",
    marginRight: 8,
  },
  levelBadge: {
    backgroundColor: '#41B2EB',
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  lockedCard: {
    opacity: 0.8,
  },
  difficultyBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    color: 'white',
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 16,
    resizeMode: "contain",
    alignSelf: 'center',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: '#333',
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  starIcon: {
    margin: 0,
    padding: 0,
    marginRight: -8,
  },
  previewText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  buttonGradient: {
    borderRadius: 0,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonIcon: {
    margin: 0,
    padding: 0,
  },
});