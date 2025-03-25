// app/screens/SettingsScreen.js
import React, { useState, useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Text,
  Card,
  Avatar,
  List,
  Switch,
  Button,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../contexts/AuthContext";

export default function SettingsScreen() {
  const { user, logout, updateUserInContext } = useContext(AuthContext);

  // Pull from user or use fallback
  const [editName, setEditName] = useState(user?.name || "John Doe");
  const [editEmail, setEditEmail] = useState(
    user?.email || "johndoe@example.com"
  );

  // If your user has an avatarUrl in DB
  const avatarUrl =
    user?.avatarUrl || "https://via.placeholder.com/100/3b82f6/ffffff?text=JD";

  // Local dark mode state
  const [isDarkMode, setIsDarkMode] = useState(
    user?.preferences?.isDarkMode || false
  );

  // Control whether we are editing or just viewing
  const [isEditing, setIsEditing] = useState(false);

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  // Save changes to the backend
  const handleSaveChanges = async () => {
    // Prepare the updates
    const updates = {
      name: editName,
      email: editEmail,
      // If you want to also save dark mode at the same time, do:
      // preferences: { isDarkMode }
    };

    // Call the context function that hits the backend
    await updateUserInContext(updates);

    // Turn off edit mode
    setIsEditing(false);
  };

  const toggleDarkMode = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);

    // Optionally update user right away or wait for a "Save" button
    // For immediate saving:
    await updateUserInContext({
      preferences: {
        isDarkMode: newValue,
      },
    });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="titleLarge" style={styles.header}>
          Settings
        </Text>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <Card.Title
            title="Profile"
            left={(props) => (
              <Avatar.Image
                {...props}
                source={{ uri: avatarUrl }}
                style={styles.avatar}
              />
            )}
          />
          <Card.Content>
            {/* If editing, show TextInputs; otherwise, show text */}
            {isEditing ? (
              <>
                <TextInput
                  label="Name"
                  value={editName}
                  onChangeText={setEditName}
                  style={styles.input}
                />
                <TextInput
                  label="Email"
                  value={editEmail}
                  onChangeText={setEditEmail}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </>
            ) : (
              <>
                <Text style={styles.profileText}>Name: {editName}</Text>
                <Text style={styles.profileText}>Email: {editEmail}</Text>
              </>
            )}
          </Card.Content>
          <Card.Actions style={styles.profileActions}>
            {isEditing ? (
              <Button onPress={handleSaveChanges} mode="contained">
                Save Changes
              </Button>
            ) : (
              <Button onPress={handleEditToggle} mode="outlined">
                Edit Profile
              </Button>
            )}
          </Card.Actions>
        </Card>

        {/* General Settings */}
        <List.Section>
          <List.Subheader>General</List.Subheader>
          <List.Item
            title="Dark Mode"
            left={() => <List.Icon icon="theme-light-dark" color="#3b82f6" />}
            right={() => (
              <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
            )}
          />
        </List.Section>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            mode="contained"
            onPress={handleLogout}
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
  input: {
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  profileText: {
    marginBottom: 6,
    fontSize: 16,
  },
  profileActions: {
    justifyContent: "flex-end",
    paddingRight: 16,
    paddingBottom: 16,
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
