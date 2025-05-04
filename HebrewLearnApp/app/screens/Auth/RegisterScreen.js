// app/screens/Auth/RegisterScreen.js
import React, { useContext, useState, useEffect } from "react";
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  Alert, 
  Animated, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from "react-native";
import {
  Button,
  TextInput,
  Text,
  HelperText,
  ActivityIndicator
} from "react-native-paper";
import { AuthContext } from "../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Adjust the relative path to match your project structure
const hoopoeRegister = require("../../../assets/HoopoeLogin.png");

export default function RegisterScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  // Local state for registration fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Validation states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Animation states
  const logoAnim = useState(new Animated.Value(0))[0];
  const formAnim = useState(new Animated.Value(0))[0];
  
  useEffect(() => {
    // Animate the logo and form sequentially
    Animated.sequence([
      Animated.spring(logoAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Validation functions
  const validateName = (text) => {
    if (!text.trim()) {
      setNameError("Name is required");
      return false;
    } else if (text.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      return false;
    } else {
      setNameError("");
      return true;
    }
  };

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

  const validateConfirmPassword = (text) => {
    if (!text) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    } else if (text !== password) {
      setConfirmPasswordError("Passwords don't match");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  // Handle registration
  const handleRegister = async () => {
    // Validate all fields
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      // Stop if any validation fails
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      // 1) Send data to your backend
      const response = await fetch(
        "https://hebrew-backend-8sozbbz4w-faeiz17s-projects.vercel.app/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      // 2) Check for errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      // 3) Parse the response
      const data = await response.json();

      // 4) Construct the user object for our AuthContext and store in AsyncStorage
      const newUser = {
        _id: data.id, // or data._id if your backend returns `_id`
        name: data.name,
        email: data.email,
        role: data.role,
      };

      await AsyncStorage.setItem("user", JSON.stringify(newUser));

      // 5) Log the user in (updates AuthContext)
      login(newUser);
      
    } catch (error) {
      Alert.alert(
        "Oops!", 
        error.message, 
        [{ text: "Try Again", style: "default" }]
      );
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
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              {/* Decorative Elements */}
              <Animatable.View animation="fadeIn" duration={1500} style={[styles.cloudElement, { top: '5%', left: '5%', transform: [{ scale: 0.8 }] }]}>
                <View style={styles.cloud} />
              </Animatable.View>
              <Animatable.View animation="fadeIn" delay={200} duration={1500} style={[styles.cloudElement, { top: '8%', right: '10%', transform: [{ scale: 0.7 }] }]}>
                <View style={styles.cloud} />
              </Animatable.View>
              <Animatable.View animation="fadeIn" delay={400} duration={1500} style={[styles.cloudElement, { top: '15%', left: '20%', transform: [{ scale: 0.6 }] }]}>
                <View style={styles.cloud} />
              </Animatable.View>

              {/* Logo/Mascot */}
              <Animated.Image
                source={hoopoeRegister}
                style={[
                  styles.logoImage,
                  {
                    opacity: logoAnim,
                    transform: [
                      {
                        translateY: logoAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-100, 0],
                        }),
                      },
                      {
                        scale: logoAnim.interpolate({
                          inputRange: [0, 0.6, 0.8, 1],
                          outputRange: [0.5, 1.2, 0.9, 1],
                        }),
                      },
                    ],
                  },
                ]}
                resizeMode="contain"
              />

              {/* Page Title */}
              <Animatable.Text 
                animation="fadeIn" 
                delay={400} 
                duration={800}
                style={styles.pageTitle}>
                Join the Adventure!
              </Animatable.Text>

              {/* Registration Form */}
              <Animated.View
                style={[
                  styles.formContainer,
                  {
                    opacity: formAnim,
                    transform: [
                      {
                        translateY: formAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {/* Name Input */}
                <TextInput
                  mode="outlined"
                  label="Name"
                  placeholder="Your name"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    validateName(text);
                  }}
                  onBlur={() => validateName(name)}
                  style={styles.input}
                  outlineStyle={{ borderRadius: 16 }}
                  theme={{ colors: { primary: '#DE8A2C' } }}
                  left={<TextInput.Icon icon="account" color="#DE8A2C" />}
                  error={!!nameError}
                  disabled={submitting}
                />
                {nameError ? (
                  <HelperText type="error" visible={!!nameError} style={styles.errorText}>
                    {nameError}
                  </HelperText>
                ) : null}

                {/* Email Input */}
                <TextInput
                  mode="outlined"
                  label="Email"
                  placeholder="Your email address"
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
                  disabled={submitting}
                />
                {emailError ? (
                  <HelperText type="error" visible={!!emailError} style={styles.errorText}>
                    {emailError}
                  </HelperText>
                ) : null}

                {/* Password Input */}
                <TextInput
                  mode="outlined"
                  label="Password"
                  placeholder="Create a password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    validatePassword(text);
                    if (confirmPassword) validateConfirmPassword(confirmPassword);
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
                      onPress={() => setShowPw((prev) => !prev)}
                    />
                  }
                  error={!!passwordError}
                  disabled={submitting}
                />
                {passwordError ? (
                  <HelperText type="error" visible={!!passwordError} style={styles.errorText}>
                    {passwordError}
                  </HelperText>
                ) : null}

                {/* Confirm Password Input */}
                <TextInput
                  mode="outlined"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    validateConfirmPassword(text);
                  }}
                  onBlur={() => validateConfirmPassword(confirmPassword)}
                  style={styles.input}
                  secureTextEntry={!showConfirmPw}
                  outlineStyle={{ borderRadius: 16 }}
                  theme={{ colors: { primary: '#DE8A2C' } }}
                  left={<TextInput.Icon icon="lock-check" color="#DE8A2C" />}
                  right={
                    <TextInput.Icon
                      icon={showConfirmPw ? "eye-off" : "eye"}
                      color="#DE8A2C"
                      onPress={() => setShowConfirmPw((prev) => !prev)}
                    />
                  }
                  error={!!confirmPasswordError}
                  disabled={submitting}
                />
                {confirmPasswordError ? (
                  <HelperText type="error" visible={!!confirmPasswordError} style={styles.errorText}>
                    {confirmPasswordError}
                  </HelperText>
                ) : null}

                {/* Sign Up Button */}
                <Button
                  mode="contained"
                  onPress={handleRegister}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  loading={submitting}
                  disabled={submitting}
                >
                  {submitting ? "Creating Account..." : "Sign Up"}
                </Button>

                {/* Back to Login Link */}
                <View style={styles.loginLinkContainer}>
                  <Text style={styles.loginText}>Already have an account?</Text>
                  <Text
                    style={styles.loginLink}
                    onPress={() => navigation.navigate("Login")}
                  >
                    Login
                  </Text>
                </View>
              </Animated.View>
            </View>
          </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },


  logoImage: {
    width: width * 0.45,
    height: width * 0.45,
    maxWidth: 220,
    maxHeight: 220,
    marginTop: Platform.OS === 'ios' ? 20 : 10,
    marginBottom: 0,
    zIndex: 2,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  formContainer: {
    width: "100%",
    maxWidth,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 30,
  },
  input: {
    marginBottom: 4,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
  },
  errorText: {
    marginBottom: 8,
    fontSize: 12,
    paddingHorizontal: 4,
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: "#DE8A2C",
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContent: {
    paddingVertical: 10,
    height: 56,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  loginLinkContainer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#444",
    marginRight: 4,
    fontSize: 16,
  },
  loginLink: {
    color: "#DE8A2C",
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});