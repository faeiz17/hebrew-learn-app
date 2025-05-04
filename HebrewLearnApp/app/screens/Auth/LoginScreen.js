// app/screens/Auth/LoginScreen.js
import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Alert, Animated, KeyboardAvoidingView, Platform } from "react-native";
import { Button, TextInput, Text, HelperText } from "react-native-paper";
import { AuthContext } from "../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";

// Adjust the relative path to match your project structure
const hoopoeLogin = require("../../../assets/HoopoeLogin.png");

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Form validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // Animated value for the hoopoe image
  const logoAnim = useState(new Animated.Value(0))[0];
  const buttonAnim = useState(new Animated.Value(0))[0];
  
  // Refs for animations
  const lottieRef = React.useRef(null);

  useEffect(() => {
    // Animate the hoopoe mascot: bounce with a fun effect
    Animated.sequence([
      Animated.spring(logoAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
    
    // Play lottie animation if exists
    if (lottieRef.current) {
      setTimeout(() => {
        lottieRef.current?.play();
      }, 500);
    }
  }, [logoAnim, buttonAnim]);

  // Validate email format
  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(text)) {
      setEmailError("Please enter a valid email");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  // Validate password
  const validatePassword = (text) => {
    if (!text) {
      setPasswordError("Password is required");
      return false;
    } else if (text.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleLogin = async () => {
    // Validate both fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return; // Stop if validation fails
    }
    
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch(
        "https://hebrew-backend-8sozbbz4w-faeiz17s-projects.vercel.app/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Something went wrong");
      }

      const data = await res.json();
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      login(data.user); // triggers Splash → Welcome
    } catch (err) {
      Alert.alert("Oops!", err.message, [{ text: "Try Again", style: "default" }]);
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={["#41B2EB", "#007AFF", "#0052CC"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <View style={styles.container}>
            {/* Clouds Background Elements */}
            <Animatable.View animation="fadeIn" duration={1500} style={[styles.cloudElement, { top: '5%', left: '10%' }]}>
              <View style={styles.cloud} />
            </Animatable.View>
            <Animatable.View animation="fadeIn" delay={300} duration={1500} style={[styles.cloudElement, { top: '10%', right: '15%' }]}>
              <View style={styles.cloud} />
            </Animatable.View>

            {/* Animated Hoopoe Mascot */}
            <Animated.Image
              source={hoopoeLogin}
              style={[
                styles.hoopoeImage,
                {
                  opacity: logoAnim,
                  transform: [
                    {
                      translateY: logoAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-150, 0], // Bounce from above
                      }),
                    },
                    {
                      scale: logoAnim.interpolate({
                        inputRange: [0, 0.5, 0.7, 1],
                        outputRange: [0.3, 1.2, 0.9, 1], // Bouncy effect
                      }),
                    },
                  ],
                },
              ]}
              resizeMode="contain"
            />

            {/* Welcome Text */}
            <Animatable.Text 
              animation="fadeIn" 
              duration={1000} 
              delay={500}
              style={styles.welcomeText}>
              Welcome Back!
            </Animatable.Text>

            {/* Text Inputs with Validation */}
            <Animatable.View 
              animation="fadeIn" 
              duration={800} 
              delay={700}
              style={styles.inputContainer}>
              <TextInput
                mode="outlined"
          
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  validateEmail(text);
                }}
                onBlur={() => validateEmail(email)}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                outlineStyle={{ borderRadius: 16 }}
                theme={{ colors: { primary: '#DE8A2C' } }}
                left={<TextInput.Icon icon="email" color="#DE8A2C" />}
                error={!!emailError}
              />
              {emailError ? (
                <HelperText type="error" visible={!!emailError}>
                  {emailError}
                </HelperText>
              ) : null}

              <TextInput
                mode="outlined"
             
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  validatePassword(text);
                }}
                onBlur={() => validatePassword(password)}
                style={styles.input}
                secureTextEntry={!showPw}
                outlineStyle={{ borderRadius: 16 }}
                theme={{ colors: { primary: '#DE8A2C' } }}
                left={<TextInput.Icon icon="lock" color="#DE8A2C" />}
                right={
                  <TextInput.Icon
                    icon={showPw ? "eye-off" : "eye"}
                    color="#DE8A2C"
                    onPress={() => setShowPw((p) => !p)}
                  />
                }
                error={!!passwordError}
              />
              {passwordError ? (
                <HelperText type="error" visible={!!passwordError}>
                  {passwordError}
                </HelperText>
              ) : null}
            </Animatable.View>

            {/* Login Button with Animation */}
            <Animated.View style={{
              width: '100%',
              maxWidth,
              opacity: buttonAnim,
              transform: [{
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                })
              }]
            }}>
              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
                labelStyle={styles.loginButtonLabel}
                loading={submitting}
                disabled={submitting}
              >
                {submitting ? "Let's Go..." : "Login"}
              </Button>
            </Animated.View>

            {/* Forgot Password Text */}
            <Animatable.Text
              animation="fadeIn"
              duration={800}
              delay={1100}
              style={styles.forgotText}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              Forgot Password?
            </Animatable.Text>

            {/* Bottom Register Link */}
            <Animatable.View
              animation="fadeInUp"
              duration={800}
              delay={1300}
              style={styles.registerContainer}
            >
              <Text style={styles.registerText}>Don't have an account?</Text>
              <Text
                style={styles.registerLink}
                onPress={() => navigation.navigate("Register")}
              >
                Register
              </Text>
            </Animatable.View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const { width, height } = Dimensions.get("window");
const maxWidth = Math.min(width * 0.9, 400);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },

  hoopoeImage: {
    width: width * 0.6,
    height: width * 0.6,
    maxWidth: 300,
    maxHeight: 300,
    marginBottom: 10,
    zIndex: 2,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  inputContainer: {
    width: "100%",
    maxWidth,
    marginBottom: 16,
  },
  input: {
    marginBottom: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#DE8A2C",
    borderRadius: 25,
    width: "100%",
    marginTop: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginButtonContent: {
    paddingVertical: 10,
    height: 56,
  },
  loginButtonLabel: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  forgotText: {
    marginTop: 16,
    color: "#fff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 24,
    alignItems: "center",
    position: "static",
    bottom: 40,
  },
  registerText: {
    color: "#fff",
    marginRight: 4,
    fontSize: 16,
  },
  registerLink: {
    color: "#FFCA28",
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});