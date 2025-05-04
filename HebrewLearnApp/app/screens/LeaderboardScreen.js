// app/screens/LeaderboardScreen.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Image,
  Animated
} from "react-native";
import {
  Text,
  Surface,
  Avatar,
  IconButton,
  Button,
  Badge,
  Divider,
  Searchbar
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";

// Import assets
const patternBackground = require("../../assets/background-pattern.png");
const trophyImage = require("../../assets/trophy.png"); // Create or import a trophy image
const hoopoeAvatar = require("../../assets/HoopoeFace.png");

// LeaderboardItem component
const LeaderboardItem = ({ item, index, animationDelay }) => {
  // Different styling for top 3 players
  const isTopThree = index < 3;
  
  // Medal colors for top 3
  const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  
  // Different background for top 3
  const topThreeGradient = index < 3 ? [
    `rgba(255,215,0,${0.2 - (index * 0.05)})`,
    `rgba(255,255,255,0.8)`
  ] : ['transparent', 'transparent'];
  
  return (
    <Animatable.View
      animation="fadeInUp"
      delay={animationDelay + (index * 100)}
      duration={500}
    >
      <Surface style={[
        styles.leaderItem,
        isTopThree && styles.topThreeItem
      ]}>
        <LinearGradient
          colors={topThreeGradient}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        
        <View style={styles.rankContainer}>
          {index < 3 ? (
            <View style={[
              styles.medalContainer,
              { backgroundColor: medalColors[index] }
            ]}>
              <Text style={styles.medalText}>{index + 1}</Text>
            </View>
          ) : (
            <Text style={styles.rankText}>{index + 1}</Text>
          )}
        </View>
        
        <View style={styles.avatarContainer}>
          <Avatar.Image
            source={item.avatarUrl ? { uri: item.avatarUrl } : hoopoeAvatar}
            size={50}
            style={styles.avatar}
          />
        </View>
        
        <View style={styles.playerInfoContainer}>
          <Text style={styles.playerName}>{item.name}</Text>
          <View style={styles.badgesContainer}>
            <Badge style={styles.levelBadge}>Lv.{item.level || 1}</Badge>
            {item.isNew && (
              <Badge style={styles.newBadge}>NEW</Badge>
            )}
          </View>
        </View>
        
        <View style={styles.scoreContainer}>
          <View style={styles.starsContainer}>
            <IconButton icon="star" size={16} color="#FFD700" style={styles.starIcon} />
            <Text style={styles.scoreText}>{item.score}</Text>
          </View>
        </View>
      </Surface>
    </Animatable.View>
  );
};

// Enhanced LeaderboardScreen
export default function LeaderboardScreen() {
  const [leaders, setLeaders] = useState([]);
  const [filteredLeaders, setFilteredLeaders] = useState([]);
  const [filterType, setFilterType] = useState('weekly'); // 'weekly', 'monthly', 'allTime'
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // Animations
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = useRef(new Animated.Value(200)).current;
  
  // Make confetti effect for podium
  const confettiAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Simulate fetching leaderboard data
    const dummyLeaders = [
      { 
        id: "1", 
        name: "Super Explorer", 
        score: 780, 
        level: 8, 
        avatarUrl: "https://randomuser.me/api/portraits/children/1.jpg"
      },
      { 
        id: "2", 
        name: "Hebrew Hero", 
        score: 650, 
        level: 7,
        avatarUrl: "https://randomuser.me/api/portraits/children/2.jpg"
      },
      { 
        id: "3", 
        name: "Word Wizard", 
        score: 520, 
        level: 6,
        avatarUrl: "https://randomuser.me/api/portraits/children/3.jpg"
      },
      { 
        id: "4", 
        name: "Language Explorer", 
        score: 440, 
        level: 5,
        isNew: true,
        avatarUrl: "https://randomuser.me/api/portraits/children/4.jpg"
      },
      { 
        id: "5", 
        name: "Story Master", 
        score: 390, 
        level: 5,
        avatarUrl: "https://randomuser.me/api/portraits/children/5.jpg"
      },
      { 
        id: "6", 
        name: "Learning Leader", 
        score: 350, 
        level: 4,
        avatarUrl: "https://randomuser.me/api/portraits/children/6.jpg"
      },
      { 
        id: "7", 
        name: "Hebrew Student", 
        score: 320, 
        level: 4,
        avatarUrl: "https://randomuser.me/api/portraits/children/7.jpg"
      },
      { 
        id: "8", 
        name: "Word Learner", 
        score: 290, 
        level: 3,
        avatarUrl: "https://randomuser.me/api/portraits/children/8.jpg"
      },
      { 
        id: "9", 
        name: "Beginner Reader", 
        score: 240, 
        level: 3,
        avatarUrl: "https://randomuser.me/api/portraits/children/9.jpg"
      },
      { 
        id: "10", 
        name: "New Explorer", 
        score: 190, 
        level: 2,
        isNew: true,
        avatarUrl: "https://randomuser.me/api/portraits/children/10.jpg"
      },
    ];
    
    setLeaders(dummyLeaders);
    setFilteredLeaders(dummyLeaders);
    
    // Start confetti animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(confettiAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);
  
  useEffect(() => {
    // Apply filters whenever filterType changes
    filterLeaderboard();
  }, [filterType, searchQuery, leaders]);
  
  const filterLeaderboard = () => {
    let filtered = [...leaders];
    
    // Apply filter by type (weekly, monthly, all time)
    // In a real app, you would fetch different data from the backend
    
    // Apply search filter if query exists
    if (searchQuery) {
      filtered = filtered.filter(leader => 
        leader.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredLeaders(filtered);
  };
  
  const handleFilterChange = (type) => {
    setFilterType(type);
  };
  
  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };
  
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };
  
  // Animation calculations for parallax header
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });
  
  // Calculate scale for confetti
  const confettiScale = confettiAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  });
  
  // Determine if there's a current user in the leaderboard to highlight
  // For demo purposes, let's assume the current user is "Word Learner"
  const currentUserIndex = filteredLeaders.findIndex(leader => leader.name === "Word Learner");

  // Header component with trophy and top players
  const ListHeaderComponent = () => (
    <>
      {/* Trophy section with parallax */}
      <Animated.View style={[
        styles.trophySection,
        { transform: [{ translateY: headerTranslateY }] }
      ]}>
        <LinearGradient
          colors={["#41B2EB", "#007AFF"]}
          style={styles.trophyGradient}
        >
          <Text style={styles.leaderboardTitle}>Leaderboard</Text>
          
          <View style={styles.trophyContainer}>
            <Animated.Image
              source={trophyImage}
              style={[
                styles.trophyImage,
                { transform: [{ scale: confettiScale }] }
              ]}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.leaderboardSubtitle}>
            Top Hebrew Learners
          </Text>
        </LinearGradient>
      </Animated.View>
      
      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        <View style={styles.filterButtons}>
          <Button
            mode={filterType === 'weekly' ? 'contained' : 'outlined'}
            onPress={() => handleFilterChange('weekly')}
            style={[
              styles.filterButton,
              filterType === 'weekly' && styles.activeFilterButton
            ]}
            labelStyle={styles.filterButtonLabel}
          >
            Weekly
          </Button>
          
          <Button
            mode={filterType === 'monthly' ? 'contained' : 'outlined'}
            onPress={() => handleFilterChange('monthly')}
            style={[
              styles.filterButton,
              filterType === 'monthly' && styles.activeFilterButton
            ]}
            labelStyle={styles.filterButtonLabel}
          >
            Monthly
          </Button>
          
          <Button
            mode={filterType === 'allTime' ? 'contained' : 'outlined'}
            onPress={() => handleFilterChange('allTime')}
            style={[
              styles.filterButton,
              filterType === 'allTime' && styles.activeFilterButton
            ]}
            labelStyle={styles.filterButtonLabel}
          >
            All Time
          </Button>
        </View>
        
        <IconButton
          icon={showSearch ? "close" : "magnify"}
          size={24}
          color="#41B2EB"
          onPress={toggleSearch}
          style={styles.searchButton}
        />
      </View>
      
      {/* Search bar (conditionally shown) */}
      {showSearch && (
        <Animatable.View
          animation="fadeIn"
          duration={300}
          style={styles.searchContainer}
        >
          <Searchbar
            placeholder="Search players"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchbar}
            iconColor="#41B2EB"
          />
        </Animatable.View>
      )}
      
      {/* Leader list header */}
      <Surface style={styles.listHeaderContainer}>
        <Text style={styles.rankHeaderText}>Rank</Text>
        <Text style={styles.playerHeaderText}>Player</Text>
        <Text style={styles.scoreHeaderText}>Score</Text>
      </Surface>
    </>
  );
  
  return (
    <ImageBackground 
      source={patternBackground} 
      style={styles.backgroundImage}
      imageStyle={styles.backgroundPattern}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.FlatList
          data={filteredLeaders}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <LeaderboardItem 
              item={item} 
              index={index}
              animationDelay={500}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={ListHeaderComponent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        />
        
        {/* User's rank card (fixed at bottom) */}
        {currentUserIndex >= 0 && (
          <Animatable.View
            animation="bounceInUp"
            duration={1000}
            delay={1000}
            style={styles.currentUserContainer}
          >
            <Surface style={styles.currentUserCard}>
              <LinearGradient
                colors={["rgba(65, 178, 235, 0.2)", "rgba(255, 255, 255, 0.8)"]}
                style={StyleSheet.absoluteFill}
              />
              
              <View style={styles.currentUserContent}>
                <Text style={styles.yourRankText}>Your Rank:</Text>
                <Text style={styles.currentUserRank}>#{currentUserIndex + 1}</Text>
                
                <View style={styles.currentUserInfo}>
                  <Avatar.Image
                    source={filteredLeaders[currentUserIndex].avatarUrl 
                      ? { uri: filteredLeaders[currentUserIndex].avatarUrl } 
                      : hoopoeAvatar}
                    size={40}
                    style={styles.currentUserAvatar}
                  />
                  <Text style={styles.currentUserName}>
                    {filteredLeaders[currentUserIndex].name}
                  </Text>
                </View>
                
                <View style={styles.currentUserScore}>
                  <IconButton icon="star" size={16} color="#FFD700" style={styles.starIcon} />
                  <Text style={styles.currentUserScoreText}>
                    {filteredLeaders[currentUserIndex].score}
                  </Text>
                </View>
              </View>
            </Surface>
          </Animatable.View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  backgroundPattern: {
    opacity: 0.05,
  },
  safeArea: {
    paddingTop:48,
    flex: 1,
  },
  listContent: {
    paddingBottom: 100, // Extra padding for the fixed user card
  },
  trophySection: {
    height: 200,
    width: '100%',
    overflow: 'hidden',
  },
  trophyGradient: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  leaderboardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  trophyContainer: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyImage: {
    height: 80,
    width: 80,
  },
  leaderboardSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    marginRight: 8,
    borderRadius: 20,
  },
  activeFilterButton: {
    backgroundColor: '#41B2EB',
  },
  filterButtonLabel: {
    fontSize: 12,
  },
  searchButton: {
    margin: 0,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  searchbar: {
    elevation: 0,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  listHeaderContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    elevation: 2,
    marginBottom: 8,
  },
  rankHeaderText: {
    width: 50,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
  },
  playerHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
  },
  scoreHeaderText: {
    width: 80,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
    textAlign: 'center',
  },
  leaderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  topThreeItem: {
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  medalText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
  },
  avatarContainer: {
    marginHorizontal: 10,
  },
  avatar: {
    backgroundColor: '#41B2EB',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  playerInfoContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  badgesContainer: {
    flexDirection: 'row',
  },
  levelBadge: {
    backgroundColor: '#41B2EB',
    fontSize: 10,
    color: '#FFFFFF',
    marginRight: 6,
  },
  newBadge: {
    backgroundColor: '#4CAF50',
    fontSize: 10,
    color: '#FFFFFF',
  },
  scoreContainer: {
    width: 80,
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starIcon: {
    margin: 0,
    padding: 0,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  currentUserContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  currentUserCard: {
    borderRadius: 16,
    padding: 16,
    elevation: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  currentUserContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  yourRankText: {
    fontSize: 12,
    color: '#666666',
  },
  currentUserRank: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#41B2EB',
  },
  currentUserInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  currentUserAvatar: {
    marginRight: 8,
  },
  currentUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  currentUserScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentUserScoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
});