// app/screens/Auth/RegisterScreen.js
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

export default function RegisterScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  // Local state for registration fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle registration
  const handleRegister = async () => {
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
        Alert.alert(
          "Registration Error",
          errorData.message || "Something went wrong"
        );
        return;
      }

      // 3) Parse the response
      const data = await response.json();
      // For example, data might be:
      // {
      //   id: "643edaf32...",
      //   name: "Alice",
      //   email: "alice@example.com",
      //   role: "student"
      // }

      // 4) Construct the user object for our AuthContext
      const newUser = {
        _id: data.id, // or data._id if your backend returns `_id`
        name: data.name,
        email: data.email,
        role: data.role,
      };

      // 5) Immediately log the user in (updates AuthContext, AsyncStorage, etc.)
      login(newUser);

      // 6) Optionally navigate to a main/home screen:
      // navigation.replace("MainNavigator");
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Avatar.Icon size={100} icon="account-plus" style={styles.logo} />
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Title style={styles.title}>Create an Account</Title>

            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
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
              onPress={handleRegister}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Sign Up
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
    backgroundColor: "#87CEEB", // sky blue accent
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
});
