// app/screens/Home/WelcomeScreen.js
import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import {
  Text,
  Button,
  Card,
  Paragraph,
  List,
  Avatar,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  // Animation for hero text
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
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
    ]).start();
  }, []);

  // Dummy data for Trusted Reviews
  const reviews = [
    { name: "John Doe", review: "This app revolutionized my Hebrew learning!" },
    {
      name: "Aisha K.",
      review: "Interactive stories make it fun and truly engaging!",
    },
    {
      name: "Leon J.",
      review: "A must-have for every Hebrew learner!",
    },
  ];

  // Dummy data for Featured Teachers
  const teachers = [
    {
      name: "Rabbi Cohen",
      subject: "Hebrew Literature",
      image: "https://via.placeholder.com/100/3b82f6/ffffff?text=RC",
    },
    {
      name: "Ms. Levine",
      subject: "Modern Hebrew",
      image: "https://via.placeholder.com/100/3b82f6/ffffff?text=ML",
    },
    {
      name: "Mr. Gold",
      subject: "Biblical Hebrew",
      image: "https://via.placeholder.com/100/3b82f6/ffffff?text=MG",
    },
  ];

  // Dummy data for Coming Soon Features
  const comingSoon = [
    {
      title: "Advanced Pronunciation",
      description: "Master your accent with interactive tools.",
      icon: "microphone",
    },
    {
      title: "Community Chat",
      description: "Connect with fellow learners in real time.",
      icon: "chat",
    },
    {
      title: "Live Classes",
      description: "Join live sessions with top teachers.",
      icon: "video",
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <Image
          source={{
            uri: "https://www.mcgill.ca/jewishstudies/files/jewishstudies/styles/wysiwyg_large/public/hebrew-alphabet-cloud-page-msh_0.jpg?itok=PlmAiCtG",
          }}
          style={styles.bannerImage}
          resizeMode="cover"
          blurRadius={2}
        />
        <View style={styles.overlay} />
        <Animated.View
          style={[
            styles.heroTextContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text variant="headlineLarge" style={styles.heroTitle}>
            Welcome to Hebrew Learning!
          </Text>
          <Text variant="bodyMedium" style={styles.heroSubtitle}>
            Master Hebrew through engaging stories and interactive exercises.
          </Text>
        </Animated.View>
      </View>

      {/* Trusted Reviews Section */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Trusted by Learners Worldwide 🌍
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {reviews.map((review, index) => (
          <Card key={index} style={styles.reviewCard}>
            <Card.Content>
              <Text variant="titleSmall">{review.name}</Text>
              <Paragraph>{review.review}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      {/* Featured Teachers Section */}
      <Text
        variant="titleMedium"
        style={[styles.sectionTitle, { marginTop: 24 }]}
      >
        Featured Teachers
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {teachers.map((teacher, index) => (
          <Card key={index} style={styles.teacherCard}>
            <Card.Title
              title={teacher.name}
              subtitle={teacher.subject}
              left={() => (
                <Avatar.Image
                  size={40}
                  source={{ uri: teacher.image }}
                  style={styles.teacherAvatar}
                />
              )}
            />
          </Card>
        ))}
      </ScrollView>

      {/* Coming Soon Features */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Coming Soon 🚀
      </Text>
      <List.Section style={styles.comingSoonSection}>
        {comingSoon.map((feature, index) => (
          <List.Item
            key={index}
            title={feature.title}
            description={feature.description}
            left={() => <List.Icon icon={feature.icon} color="#3b82f6" />}
          />
        ))}
      </List.Section>

      {/* Call-to-Action Buttons */}
      <Animated.View style={[styles.buttonsContainer]}>
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate("AppFlow", {
              screen: "Levels",
            })
          }
          style={styles.mainButton}
        >
          📖 Explore Levels
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Leaderboard")}
          style={styles.mainButton}
        >
          🏆 Leaderboard
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Settings")}
          style={styles.mainButton}
        >
          ⚙ Settings
        </Button>
      </Animated.View>
    </ScrollView>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F5F5",
  },
  heroContainer: {
    position: "relative",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  heroTextContainer: {
    position: "absolute",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  heroTitle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  heroSubtitle: {
    color: "#fff",
    textAlign: "center",
    marginTop: 8,
  },
  sectionTitle: {
    marginTop: 24,
    marginLeft: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  horizontalScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  reviewCard: {
    width: 220,
    marginRight: 12,
    elevation: 4,
    borderRadius: 8,
  },
  teacherCard: {
    width: 180,
    marginRight: 12,
    elevation: 4,
    borderRadius: 8,
  },
  teacherAvatar: {
    backgroundColor: "#3b82f6",
  },
  comingSoonSection: {
    marginVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#F5F5F5",
  },
  buttonsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  mainButton: {
    marginVertical: 6,
    backgroundColor: "#3b82f6",
    color: "white",
    flex: 1,
    marginHorizontal: 4,
  },
});
