// app/screens/Auth/LoginScreen.js
import React, { useContext, useState } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import {
  Button,
  TextInput,
  Text,
  Card,
  Title,
  Avatar,
} from "react-native-paper";
import { AuthContext } from "../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
// IMPORTANT: import AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // 1) Make a POST request to your deployed backend
      const response = await fetch(
        "https://hebrew-backend-8sozbbz4w-faeiz17s-projects.vercel.app/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      // 2) If the server responds with an error status, handle it
      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert("Login Error", errorData.message || "Something went wrong");
        return;
      }

      // 3) Parse the JSON response
      const data = await response.json();
      // data should look like: { message: 'Login successful', user: { ...fields } }

      // 4) Save the user data in AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      // 5) Update context with the user
      login(data.user);

      // 6) Optionally navigate somewhere else (e.g., a Home screen)
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Avatar.Icon size={100} icon="account" style={styles.logo} />
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Title style={styles.title}>Login</Title>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              label="Password"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Login
            </Button>
            <Button
              mode="text"
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.link}
              labelStyle={styles.linkText}
            >
              Forgot Password?
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("Register")}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
            >
              New user? Sign Up
            </Button>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");
const cardWidth = Math.min(width * 0.9, 400);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  logo: {
    backgroundColor: "#87CEEB",
    marginBottom: 24,
  },
  card: {
    width: cardWidth,
    borderRadius: 12,
    elevation: 6,
    backgroundColor: "#ffffff",
  },
  cardContent: {
    paddingVertical: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    marginVertical: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  link: {
    marginVertical: 4,
  },
  linkText: {
    fontSize: 14,
  },
  registerButton: {
    marginTop: 8,
  },
});
