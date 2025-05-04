// app/screens/SettingsScreen.js
import React, { useState, useContext, useEffect } from "react";
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Platform
} from "react-native";
import {
  Text,
  Card,
  Avatar,
  List,
  Switch,
  Button,
  TextInput,
  IconButton,
  Surface,
  Badge,
  Divider
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { StatusBar } from "expo-status-bar";
import { AuthContext } from "../contexts/AuthContext";

// Import assets
const patternBackground = require("../../assets/background-pattern.png");
const hoopoeAvatar = require("../../assets/HoopoeFace.png");

export default function SettingsScreen() {
  const { user, logout, updateUserInContext } = useContext(AuthContext);

  // Pull from user or use fallback
  const [editName, setEditName] = useState(user?.name || "Young Explorer");
  const [editEmail, setEditEmail] = useState(
    user?.email || "explorer@hebrewadventure.com"
  );

  // If your user has an avatarUrl in DB
  const avatarUrl = user?.avatarUrl;

  // Local dark mode state
  const [isDarkMode, setIsDarkMode] = useState(
    user?.preferences?.isDarkMode || false
  );
  
  // Sound effects state
  const [soundEffects, setSoundEffects] = useState(
    user?.preferences?.soundEffects || true
  );
  
  // Pronunciation speed
  const [pronunciationSpeed, setPronunciationSpeed] = useState(
    user?.preferences?.pronunciationSpeed || "normal"
  );

  // Control whether we are editing or just viewing
  const [isEditing, setIsEditing] = useState(false);
  
  // Animation control
  const [animationsVisible, setAnimationsVisible] = useState([]);

  useEffect(() => {
    // Trigger animations sequentially
    const timeouts = [];
    
    ["header", "profileCard", "settingsGeneral", "settingsSound", 
     "settingsSpeed", "logoutButton"].forEach((item, index) => {
      const timeout = setTimeout(() => {
        setAnimationsVisible(prev => [...prev, item]);
      }, 300 + (index * 150));
      
      timeouts.push(timeout);
    });
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

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
      preferences: { 
        isDarkMode,
        soundEffects,
        pronunciationSpeed
      }
    };

    // Call the context function that hits the backend
    await updateUserInContext(updates);

    // Turn off edit mode
    setIsEditing(false);
  };

  const toggleDarkMode = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);

    // Update user preferences
    await updateUserInContext({
      preferences: {
        ...user?.preferences,
        isDarkMode: newValue,
      },
    });
  };
  
  const toggleSoundEffects = async () => {
    const newValue = !soundEffects;
    setSoundEffects(newValue);

    // Update user preferences
    await updateUserInContext({
      preferences: {
        ...user?.preferences,
        soundEffects: newValue,
      },
    });
  };
  
  const handleSpeedChange = async (speed) => {
    setPronunciationSpeed(speed);
    
    // Update user preferences
    await updateUserInContext({
      preferences: {
        ...user?.preferences,
        pronunciationSpeed: speed,
      },
    });
  };

  const handleLogout = () => {
    logout();
  };

  const renderAnimatedView = (name, component) => {
    if (!animationsVisible.includes(name)) {
      return null;
    }
    
    return (
      <Animatable.View
        animation="fadeInUp"
        duration={800}
        style={{ width: '100%' }}
      >
        {component}
      </Animatable.View>
    );
  };

  return (
    <ImageBackground 
      source={patternBackground} 
      style={styles.backgroundImage}
      imageStyle={styles.backgroundPattern}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          {renderAnimatedView(
            "header",
            <View style={styles.headerContainer}>
              <LinearGradient
                colors={["#41B2EB", "#007AFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerGradient}
              >
                <Text style={styles.headerTitle}>My Settings</Text>
              </LinearGradient>
            </View>
          )}

          {/* Profile Card */}
          {renderAnimatedView(
            "profileCard",
            <Surface style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                  <Avatar.Image 
                    size={80}
                    source={avatarUrl ? { uri: avatarUrl } : hoopoeAvatar}
                    style={styles.avatar}
                  />
                  <Badge style={styles.levelBadge}>Lv. 10</Badge>
                </View>
                
                <View style={styles.profileInfo}>
                  {isEditing ? (
                    <TextInput
                      label="Name"
                      value={editName}
                      onChangeText={setEditName}
                      style={styles.input}
                      mode="outlined"
                      outlineColor="#DDDDDD"
                      activeOutlineColor="#41B2EB"
                    />
                  ) : (
                    <Text style={styles.profileName}>{editName}</Text>
                  )}
                  
                  {isEditing ? (
                    <TextInput
                      label="Email"
                      value={editEmail}
                      onChangeText={setEditEmail}
                      style={styles.input}
                      mode="outlined"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      outlineColor="#DDDDDD"
                      activeOutlineColor="#41B2EB"
                    />
                  ) : (
                    <Text style={styles.profileEmail}>{editEmail}</Text>
                  )}
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.profileStatsContainer}>
                <View style={styles.statItem}>
                  <IconButton icon="star" size={24} color="#FFD700" style={styles.statIcon} />
                  <Text style={styles.statValue}>47</Text>
                  <Text style={styles.statLabel}>Stars</Text>
                </View>
                
                <View style={styles.statDivider} />
                
                <View style={styles.statItem}>
                  <IconButton icon="trophy" size={24} color="#FF9800" style={styles.statIcon} />
                  <Text style={styles.statValue}>320</Text>
                  <Text style={styles.statLabel}>Points</Text>
                </View>
                
                <View style={styles.statDivider} />
                
                <View style={styles.statItem}>
                  <IconButton icon="book-open-variant" size={24} color="#4CAF50" style={styles.statIcon} />
                  <Text style={styles.statValue}>5</Text>
                  <Text style={styles.statLabel}>Level</Text>
                </View>
              </View>
              
              <View style={styles.profileActions}>
                {isEditing ? (
                  <Button 
                    onPress={handleSaveChanges} 
                    mode="contained"
                    style={styles.saveButton}
                    labelStyle={styles.buttonLabel}
                  >
                    Save Changes
                  </Button>
                ) : (
                  <Button 
                    onPress={handleEditToggle} 
                    mode="outlined"
                    style={styles.editButton}
                    labelStyle={styles.editButtonLabel}
                    icon="account-edit"
                  >
                    Edit Profile
                  </Button>
                )}
              </View>
            </Surface>
          )}

          {/* Settings Sections */}
          <Text style={styles.sectionTitle}>Settings</Text>
          
          {/* General Settings */}
          {renderAnimatedView(
            "settingsGeneral",
            <Surface style={styles.settingsCard}>
              <List.Item
                title="Dark Mode"
                description="Switch to dark theme"
                left={() => <List.Icon icon="theme-light-dark" color="#41B2EB" />}
                right={() => (
                  <Switch
                    value={isDarkMode}
                    onValueChange={toggleDarkMode}
                    color="#41B2EB"
                  />
                )}
                style={styles.listItem}
              />
            </Surface>
          )}
          
          {/* Sound Settings */}
          {renderAnimatedView(
            "settingsSound",
            <Surface style={styles.settingsCard}>
              <List.Item
                title="Sound Effects"
                description="Enable fun sounds in the app"
                left={() => <List.Icon icon="volume-high" color="#DE8A2C" />}
                right={() => (
                  <Switch
                    value={soundEffects}
                    onValueChange={toggleSoundEffects}
                    color="#DE8A2C"
                  />
                )}
                style={styles.listItem}
              />
            </Surface>
          )}
          
          {/* Pronunciation Speed */}
          {renderAnimatedView(
            "settingsSpeed",
            <Surface style={styles.settingsCard}>
              <List.Item
                title="Pronunciation Speed"
                description="Adjust how fast words are spoken"
                left={() => <List.Icon icon="speedometer" color="#4CAF50" />}
                style={[styles.listItem, styles.speedListItem]}
              />
              
              <View style={styles.speedButtonsContainer}>
                <Button
                  mode={pronunciationSpeed === "slow" ? "contained" : "outlined"}
                  onPress={() => handleSpeedChange("slow")}
                  style={[
                    styles.speedButton,
                    pronunciationSpeed === "slow" && styles.activeSpeedButton
                  ]}
                  labelStyle={styles.speedButtonLabel}
                >
                  Slow
                </Button>
                
                <Button
                  mode={pronunciationSpeed === "normal" ? "contained" : "outlined"}
                  onPress={() => handleSpeedChange("normal")}
                  style={[
                    styles.speedButton,
                    pronunciationSpeed === "normal" && styles.activeSpeedButton
                  ]}
                  labelStyle={styles.speedButtonLabel}
                >
                  Normal
                </Button>
                
                <Button
                  mode={pronunciationSpeed === "fast" ? "contained" : "outlined"}
                  onPress={() => handleSpeedChange("fast")}
                  style={[
                    styles.speedButton,
                    pronunciationSpeed === "fast" && styles.activeSpeedButton
                  ]}
                  labelStyle={styles.speedButtonLabel}
                >
                  Fast
                </Button>
              </View>
            </Surface>
          )}

          {/* Logout Button */}
          {renderAnimatedView(
            "logoutButton",
            <View style={styles.logoutContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleLogout}
              >
                <LinearGradient
                  colors={["#F44336", "#D32F2F"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.logoutButton}
                >
                  <Text style={styles.logoutButtonText}>Log Out</Text>
                  <IconButton icon="logout" color="#FFFFFF" size={24} style={styles.logoutIcon} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Version Info */}
          <Text style={styles.versionText}>Hebrew Adventure v1.2.0</Text>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  backgroundPattern: {
    opacity: 0.05,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 30,
    paddingBottom: 30,
    paddingTop:50
  },
  headerContainer: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  profileCard: {
    borderRadius: 16,
    marginBottom: 24,
    elevation: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  profileHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    backgroundColor: '#41B2EB',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    backgroundColor: '#DE8A2C',
    color: '#FFFFFF',
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666666',
  },
  input: {
    marginVertical: 4,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  profileStatsContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F9',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    margin: 0,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  statDivider: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
    backgroundColor: '#EEEEEE',
  },
  profileActions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'flex-end',
  },
  saveButton: {
    backgroundColor: '#41B2EB',
    borderRadius: 8,
  },
  buttonLabel: {
    fontWeight: 'bold',
  },
  editButton: {
    borderColor: '#41B2EB',
    borderRadius: 8,
  },
  editButtonLabel: {
    color: '#41B2EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    marginLeft: 8,
  },
  settingsCard: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  listItem: {
    paddingVertical: 8,
  },
  speedListItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  speedButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  speedButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeSpeedButton: {
    backgroundColor: '#4CAF50',
  },
  speedButtonLabel: {
    fontSize: 12,
  },
  logoutContainer: {
    marginTop: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    width: width * 0.6,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutIcon: {
    margin: 0,
  },
  versionText: {
    textAlign: 'center',
    color: '#999999',
    fontSize: 12,
    marginBottom: 8,
  }
});