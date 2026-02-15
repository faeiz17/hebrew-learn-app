import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, StyleSheet, ImageBackground, ScrollView, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";

import { Images } from "@/assets/images";
import { Text, Button } from "@/atoms";
import useColors from "@/hooks/useColors";
import { TopBar } from "@/molecules";
import { User } from "@/types";
import { useTheme } from "@/utils/theme-engine";

const { height } = Dimensions.get("window");

interface WelcomeTemplateProps {
  user: User | null;
  onContinueLearning: () => void;
  onTryDemo: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onMenu: () => void;
}

const patternBackground = Images.BackgroundPattern;
const hoopoeHappy = Images.HoopoeFace;

const WelcomeTemplate: React.FC<WelcomeTemplateProps> = ({
  user,
  onContinueLearning,
  onTryDemo,
  onLogin,
  onRegister,
  onMenu,
}) => {
  const colors = useColors();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.blue6 as string, colors.blue7 as string]}
        style={StyleSheet.absoluteFill}
      />

      <ImageBackground
        source={patternBackground}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundPattern}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <Animatable.View
            animation="fadeInDown"
            duration={1000}
            style={styles.header}
          >
            <Text variant="h1" style={[theme.styles.headingL, styles.title]}>
              Welcome to{"\n"}Hebrew Learn
            </Text>
            <Animatable.View animation="pulse" iterationCount="infinite" duration={2000}>
              <Text variant="body" style={[theme.styles.labelL, styles.subtitle]}>
                {user?.name ? `${user.name}!` : "Ready to explorer?"}
              </Text>
            </Animatable.View>
          </Animatable.View>

          {/* Mascot Section */}
          <Animatable.View
            animation="bounceIn"
            duration={2000}
            style={styles.mascotContainer}
          >
            <View style={[styles.mascotCircle, { backgroundColor: "rgba(255, 255, 255, 1)" }]}>
              <ImageBackground
                source={hoopoeHappy}
                style={styles.mascotImage}
                resizeMode="contain"
              />
            </View>
          </Animatable.View>

          {/* Action Cards */}
          <Animatable.View
            animation="fadeInUp"
            delay={500}
            style={[
              styles.card,
              {
                borderRadius: theme.radius[300],
                backgroundColor: colors.custom0 as string
              }
            ]}
          >
            <View style={styles.actionsContainer}>
              <Button
                mode="contained"
                onPress={onContinueLearning}
                style={[styles.button, { backgroundColor: colors.blue6 as string }]}
                labelStyle={styles.buttonLabel}
              >
                {user ? "Continue Learning" : "Start Learning"}
              </Button>
            </View>

            {!user && (
              <View style={styles.authWrapper}>
                <View style={styles.divider} />
                <View style={styles.authButtons}>
                  <Button
                    mode="text"
                    onPress={onLogin}
                    labelStyle={{ color: colors.blue7 as string }}
                  >
                    Log In
                  </Button>
                  <View style={styles.dot} />
                  <Button
                    mode="text"
                    onPress={onRegister}
                    labelStyle={{ color: colors.blue7 as string }}
                  >
                    Create Account
                  </Button>
                </View>
              </View>
            )}
          </Animatable.View>

          <View style={styles.footer}>
            <Text variant="caption" style={styles.footerText}>
              Master Hebrew one level at a time.
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>

      <TopBar
        title="Hebrew Adventure"
        onMenu={onMenu}
        style={styles.absoluteHeader}
        titleColor="#FFFFFF"
        iconColor="#FFFFFF"
        hideShadow
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  backgroundPattern: {
    opacity: 0.08,
    tintColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    alignItems: "center",
    paddingTop: height * 0.12,
  },
  absoluteHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    borderBottomWidth: 0,
  },
  header: {
    marginTop: height * 0.12,
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 8,
    fontWeight: "600",
  },
  mascotContainer: {
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  mascotImage: {
    width: 140,
    height: 140,
  },
  card: {
    width: "100%",
    padding: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  actionsContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    paddingVertical: 8,
    borderRadius: 12,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  outlineButton: {
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
  },
  authWrapper: {
    marginTop: 24,
    alignItems: "center",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    marginBottom: 16,
  },
  authButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    marginHorizontal: 8,
  },
  footer: {
    marginTop: "auto",
    paddingVertical: 24,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default WelcomeTemplate;
