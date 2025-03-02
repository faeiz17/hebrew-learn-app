// app/screens/Auth/RegisterScreen.js
import React, { useContext, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // Call your backend to register; on success, update context.
    login({ email });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Avatar.Icon size={100} icon="account-plus" style={styles.logo} />
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Title style={styles.title}>Create an Account</Title>
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
