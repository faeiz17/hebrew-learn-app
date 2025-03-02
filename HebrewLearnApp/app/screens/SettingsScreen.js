// app/screens/SettingsScreen.js
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Card, Avatar, List, Switch, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  // Dummy user data
  const dummyUser = {
    name: "John Doe",
    email: "johndoe@example.com",
    avatar: "https://via.placeholder.com/100/3b82f6/ffffff?text=JD",
  };

  // Dummy state for dark mode toggle
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="titleLarge" style={styles.header}>
          Settings
        </Text>
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <Card.Title
            title={dummyUser.name}
            subtitle={dummyUser.email}
            left={(props) => (
              <Avatar.Image
                {...props}
                source={{ uri: dummyUser.avatar }}
                style={styles.avatar}
              />
            )}
          />
        </Card>
        {/* General Settings */}
        <List.Section>
          <List.Subheader>General</List.Subheader>
          <List.Item
            title="Account"
            description="Manage your account settings"
            left={() => <List.Icon icon="account-circle" color="#3b82f6" />}
            onPress={() => {}}
          />
          <List.Item
            title="Notifications"
            description="Notification preferences"
            left={() => <List.Icon icon="bell" color="#3b82f6" />}
            onPress={() => {}}
          />
          <List.Item
            title="Privacy"
            description="Privacy and security settings"
            left={() => <List.Icon icon="lock" color="#3b82f6" />}
            onPress={() => {}}
          />
          <List.Item
            title="Dark Mode"
            left={() => <List.Icon icon="theme-light-dark" color="#3b82f6" />}
            right={() => (
              <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
            )}
          />
        </List.Section>
        {/* Support Settings */}
        <List.Section>
          <List.Subheader>Support</List.Subheader>
          <List.Item
            title="Help & Support"
            left={() => <List.Icon icon="help-circle" color="#3b82f6" />}
            onPress={() => {}}
          />
          <List.Item
            title="About"
            left={() => <List.Icon icon="information" color="#3b82f6" />}
            onPress={() => {}}
          />
        </List.Section>
        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            mode="contained"
            onPress={() => {}}
            style={styles.logoutButton}
            contentStyle={styles.buttonContent}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "#3b82f6",
  },
  profileCard: {
    marginBottom: 24,
    borderRadius: 12,
    elevation: 4,
  },
  avatar: {
    backgroundColor: "#3b82f6",
  },
  logoutContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#F44336",
    width: "80%",
  },
  buttonContent: {
    paddingVertical: 10,
  },
});
