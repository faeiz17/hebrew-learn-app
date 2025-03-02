// app/screens/Auth/ForgotPasswordScreen.js
import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import {
  Button,
  TextInput,
  Text,
  Card,
  Title,
  Avatar,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const handleReset = () => {
    // call your backend to send reset link/email
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Avatar.Icon size={80} icon="lock-reset" style={styles.icon} />
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Title style={styles.title}>Reset Password</Title>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Button
              mode="contained"
              onPress={handleReset}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Send Reset Email
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
  icon: {
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
