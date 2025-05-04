import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import {
  Text,
  Button,
  Card,
  Paragraph,
  Avatar,
  IconButton,
  Badge,
  Surface,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

// SVG assets for decorative elements
const cloudSvg = `
<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
  <path fill="#FFFFFF" d="M85,35c0-8.3-6.7-15-15-15c-2.9,0-5.6,0.8-7.9,2.3C58.9,14.8,51.9,10,44,10c-11,0-20,9-20,20
  c0,0.4,0,0.7,0.1,1.1C15.6,32.5,10,39.1,10,47c0,8.3,6.7,15,15,15h45c11,0,20-9,20-20C90,39.4,88,36.2,85,35z"/>
</svg>
`;

const starSvg = `
<svg viewBox="0 0 51 48" xmlns="http://www.w3.org/2000/svg">
  <path fill="#FFD700" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
</svg>
`;

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [scrollY, setScrollY] = useState(new Animated.Value(0));

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;
  
  // Animation for floating elements
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set up floating animations
    const floatAnimation = (anim, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    floatAnimation(floatAnim1, 0);
    floatAnimation(floatAnim2, 700);
    floatAnimation(floatAnim3, 1400);

    // Set up main animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(buttonsAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Configure status bar
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);

  // Parallax effect for hero image
  const imageTranslateY = scrollY.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [50, 0, -50],
    extrapolate: 'clamp',
  });

  // Dummy data for Trusted Reviews
  const reviews = [
    { 
      name: "John D.", 
      review: "This app revolutionized my Hebrew learning!",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5
    },
    {
      name: "Aisha K.",
      review: "Interactive stories make it fun and truly engaging!",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5
    },
    {
      name: "Leon J.",
      review: "A must-have for every Hebrew learner!",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg",
      rating: 4
    },
    {
      name: "Sophie T.",
      review: "My kids love the interactive stories and games!",
      avatar: "https://randomuser.me/api/portraits/women/26.jpg",
      rating: 5
    },
  ];

  // Dummy data for Featured Teachers
  const teachers = [
    {
      name: "Rabbi Cohen",
      subject: "Hebrew Literature",
      image: "https://randomuser.me/api/portraits/men/42.jpg",
      badge: "Top Rated"
    },
    {
      name: "Ms. Levine",
      subject: "Modern Hebrew",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      badge: "Popular"
    },
    {
      name: "Mr. Gold",
      subject: "Biblical Hebrew",
      image: "https://randomuser.me/api/portraits/men/29.jpg",
      badge: "Expert"
    },
    {
      name: "Dr. Sarah",
      subject: "Hebrew History",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
      badge: "New"
    },
  ];

  // Dummy data for Coming Soon Features
  const comingSoon = [
    {
      title: "Advanced Pronunciation",
      description: "Master your accent with AI-powered interactive tools.",
      icon: "microphone",
      color: "#FF6B6B"
    },
    {
      title: "Community Chat",
      description: "Connect with fellow learners in real time.",
      icon: "chat-processing",
      color: "#48DBFB"
    },
    {
      title: "Live Classes",
      description: "Join live sessions with top teachers.",
      icon: "video",
      color: "#1DD1A1"
    },
  ];

  // Render star ratings
  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, i) => (
          <IconButton
            key={i}
            icon={i < rating ? "star" : "star-outline"}
            size={16}
            color={i < rating ? "#FFD700" : "#AAAAAA"}
            style={styles.starIcon}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['right', 'left']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Floating decorative elements */}
      <Animated.View 
        style={[
          styles.floatingElement,
          {
            top: '15%',
            right: '10%',
            transform: [{
              translateY: floatAnim1.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -15]
              })
            }]
          }
        ]}
      >
        <SvgXml xml={cloudSvg} width={60} height={30} opacity={0.8} />
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.floatingElement,
          {
            top: '5%',
            left: '15%',
            transform: [{
              translateY: floatAnim2.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10]
              })
            }]
          }
        ]}
      >
        <SvgXml xml={cloudSvg} width={80} height={48} opacity={0.7} />
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.floatingElement,
          {
            top: '25%',
            left: '5%',
            transform: [{
              translateY: floatAnim3.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -12]
              })
            }]
          }
        ]}
      >
        <SvgXml xml={starSvg} width={30} height={30} opacity={0.8} />
      </Animated.View>

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
        {/* Hero Section with Parallax */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={["#41B2EB", "#007AFF", "#0052CC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientOverlay}
          />
          
          <Animated.Image
            source={require("../../../assets/HomeScreen.png")}
            style={[
              styles.heroImage,
              {
                transform: [{ translateY: imageTranslateY }]
              }
            ]}
            resizeMode="cover"
          />
          
          <View style={styles.heroOverlay}>
            <Animated.View
              style={[
                styles.heroContent,
                { 
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ] 
                }
              ]}
            >
              <Text variant="headlineLarge" style={styles.heroTitle}>
                Welcome to Hebrew Adventure!
              </Text>
              <Text variant="bodyLarge" style={styles.heroSubtitle}>
                Embark on a magical journey to master Hebrew through interactive stories and fun games
              </Text>
            </Animated.View>
          </View>
        </View>

        {/* Quick Stats Section */}
        <Animatable.View 
          animation="fadeInUp" 
          delay={800} 
          duration={1200}
          style={styles.statsContainer}
        >
          <Surface style={styles.statItem}>
            <IconButton icon="book-open-variant" size={28} color="#41B2EB" />
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </Surface>
          
          <Surface style={styles.statItem}>
            <IconButton icon="account-group" size={28} color="#DE8A2C" />
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Students</Text>
          </Surface>
          
          <Surface style={styles.statItem}>
            <IconButton icon="star" size={28} color="#FFD700" />
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </Surface>
        </Animatable.View>

        {/* Student Reviews Section */}
        <View style={styles.sectionContainer}>
          <Animatable.View 
            animation="fadeInLeft" 
            delay={900} 
            duration={1000}
          >
            <Text variant="titleMedium" style={styles.sectionTitle}>
              <IconButton icon="comment-quote" size={20} color="#41B2EB" style={styles.inlineIcon} />
              Trusted by Learners Worldwide
            </Text>
          </Animatable.View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reviewsScrollContainer}
            snapToInterval={width * 0.75 + 16}
            decelerationRate="fast"
          >
            {reviews.map((review, index) => (
              <Animatable.View
                key={index}
                animation="fadeIn"
                delay={1000 + (index * 200)}
                duration={800}
              >
                <Card style={styles.reviewCard} mode="elevated">
                  <Card.Content style={styles.reviewCardContent}>
                    <View style={styles.reviewHeader}>
                      <Avatar.Image source={{ uri: review.avatar }} size={50} />
                      <View style={styles.reviewHeaderText}>
                        <Text variant="titleMedium" style={styles.reviewerName}>{review.name}</Text>
                        {renderStars(review.rating)}
                      </View>
                    </View>
                    <View style={styles.quotesContainer}>
                      <Text style={styles.quoteIcon}>"</Text>
                      <Paragraph style={styles.reviewText}>{review.review}</Paragraph>
                      <Text style={[styles.quoteIcon, styles.quoteIconRight]}>"</Text>
                    </View>
                  </Card.Content>
                </Card>
              </Animatable.View>
            ))}
          </ScrollView>
        </View>

        {/* Featured Teachers Section */}
        <View style={styles.sectionContainer}>
          <Animatable.View 
            animation="fadeInLeft" 
            delay={1100} 
            duration={1000}
          >
            <Text variant="titleMedium" style={styles.sectionTitle}>
              <IconButton icon="school" size={20} color="#41B2EB" style={styles.inlineIcon} />
              Our Amazing Teachers
            </Text>
          </Animatable.View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.teachersScrollContainer}
          >
            {teachers.map((teacher, index) => (
              <Animatable.View
                key={index}
                animation="fadeIn"
                delay={1200 + (index * 200)}
                duration={800}
              >
                <Card style={styles.teacherCard} mode="elevated">
                  <View style={styles.badgeContainer}>
                    <Badge style={styles.badge}>{teacher.badge}</Badge>
                  </View>
                  <Avatar.Image
                    source={{ uri: teacher.image }}
                    size={80}
                    style={styles.teacherAvatar}
                  />
                  <Card.Content style={styles.teacherCardContent}>
                    <Text variant="titleMedium" style={styles.teacherName}>{teacher.name}</Text>
                    <Text variant="bodyMedium" style={styles.teacherSubject}>{teacher.subject}</Text>
                    <Button 
                      mode="text" 
                      compact 
                      style={styles.viewProfileButton}
                      labelStyle={styles.viewProfileButtonLabel}
                    >
                      View Profile
                    </Button>
                  </Card.Content>
                </Card>
              </Animatable.View>
            ))}
          </ScrollView>
        </View>

        {/* Coming Soon Features */}
        <View style={styles.sectionContainer}>
          <Animatable.View 
            animation="fadeInLeft" 
            delay={1300} 
            duration={1000}
          >
            <Text variant="titleMedium" style={styles.sectionTitle}>
              <IconButton icon="rocket-launch" size={20} color="#41B2EB" style={styles.inlineIcon} />
              Coming Soon
            </Text>
          </Animatable.View>
          
          <View style={styles.featureCardsContainer}>
            {comingSoon.map((feature, index) => (
              <Animatable.View
                key={index}
                animation="fadeInUp"
                delay={1400 + (index * 200)}
                duration={800}
                style={styles.featureCardWrapper}
              >
                <Surface style={styles.featureCard}>
                  <View style={[styles.featureIconContainer, { backgroundColor: feature.color }]}>
                    <IconButton icon={feature.icon} size={28} color="#FFFFFF" />
                  </View>
                  <Text variant="titleMedium" style={styles.featureTitle}>{feature.title}</Text>
                  <Text variant="bodySmall" style={styles.featureDescription}>{feature.description}</Text>
                </Surface>
              </Animatable.View>
            ))}
          </View>
        </View>

        {/* Call-to-Action Buttons */}
        <Animated.View 
          style={[
            styles.ctaContainer,
            {
              opacity: buttonsAnim,
              transform: [{
                translateY: buttonsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                })
              }]
            }
          ]}
        >
          <LinearGradient
            colors={["#41B2EB", "#007AFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startLearningButton}
          >
            <TouchableOpacity 
              style={styles.gradientButton}
              onPress={() => navigation.navigate("AppFlow", { screen: "Levels" })}
            >
              <Text style={styles.gradientButtonText}>Start Learning</Text>
              <IconButton icon="arrow-right" color="#FFF" size={20} style={styles.buttonIcon} />
            </TouchableOpacity>
          </LinearGradient>
          
          <View style={styles.secondaryButtonsRow}>
            <TouchableOpacity 
              style={[styles.secondaryButton, { backgroundColor: '#FFC107' }]}
              onPress={() => navigation.navigate("Leaderboard")}
            >
              <IconButton icon="trophy" color="#FFF" size={24} style={styles.secondaryButtonIcon} />
              <Text style={styles.secondaryButtonText}>Leaderboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.secondaryButton, { backgroundColor: '#FF7043' }]}
              onPress={() => navigation.navigate("Settings")}
            >
              <IconButton icon="cog" color="#FFF" size={24} style={styles.secondaryButtonIcon} />
              <Text style={styles.secondaryButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  floatingElement: {
    position: 'absolute',
    zIndex: 10,
  },
  heroSection: {
    height: height * 0.45,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
    zIndex: 1,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 0,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    maxWidth: 500,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -40,
    zIndex: 3,
    marginBottom: 16,
  },
  statItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: (width - 48) / 3,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineIcon: {
    margin: 0,
    padding: 0,
  },
  reviewsScrollContainer: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  reviewCard: {
    width: width * 0.75,
    marginRight: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  reviewCardContent: {
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  reviewerName: {
    fontWeight: 'bold',
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 2,
  },
  starIcon: {
    margin: 0,
    padding: 0,
    marginRight: -8,
  },
  quotesContainer: {
    position: 'relative',
    paddingHorizontal: 8,
  },
  quoteIcon: {
    fontSize: 40,
    color: '#41B2EB',
    opacity: 0.2,
    position: 'absolute',
    top: -15,
    left: 0,
  },
  quoteIconRight: {
    left: 'auto',
    right: 0,
    top: 'auto',
    bottom: -25,
  },
  reviewText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
    fontStyle: 'italic',
    paddingHorizontal: 8,
  },
  teachersScrollContainer: {
    paddingBottom: 8,
  },
  teacherCard: {
    width: 160,
    marginRight: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  badge: {
    backgroundColor: '#41B2EB',
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  teacherAvatar: {
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#41B2EB',
  },
  teacherCardContent: {
    alignItems: 'center',
    padding: 0,
  },
  teacherName: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  teacherSubject: {
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  viewProfileButton: {
    marginTop: 8,
  },
  viewProfileButtonLabel: {
    color: '#41B2EB',
    fontSize: 12,
  },
  featureCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  featureCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  featureCard: {
    borderRadius: 16,
    padding: 16,
    height: 160,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  featureDescription: {
    color: '#666',
    lineHeight: 18,
  },
  ctaContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    marginTop: 16,
  },
  startLearningButton: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  gradientButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    margin: 0,
  },
  secondaryButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '48%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  secondaryButtonIcon: {
    margin: 0,
    padding: 0,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
});