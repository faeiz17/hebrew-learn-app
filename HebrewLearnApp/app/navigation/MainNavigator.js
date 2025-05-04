import React from "react";
import { View, StyleSheet, Image, Dimensions, Platform } from "react-native";
import { 
  createDrawerNavigator,
  DrawerContentScrollView, 
  DrawerItemList,
  DrawerItem 
} from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { Text, Avatar, IconButton, Badge, Divider } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";

// Screens for the drawer
import WelcomeScreen from "../screens/Home/WelcomeScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import SettingsScreen from "../screens/SettingsScreen";

// Our stack that includes Levels -> Story -> Exercise
import AppStack from "./AppStack";

// Import custom icons (assuming you have these assets)
const hoopoeIcon = require("../../assets/HoopoeLogin.png");

const Drawer = createDrawerNavigator();

// Custom Drawer Content component
function CustomDrawerContent(props) {
  // Mock user data - replace with real user data from your auth context
  const user = {
    name: "Young Explorer",
    level: 12,
    points: 2450,
    avatar: "https://randomuser.me/api/portraits/kids/3.jpg",
    starsEarned: 47,
    streak: 8
  };

  return (
    <LinearGradient
      colors={["#41B2EB", "#0072FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.drawerContent}
          showsVerticalScrollIndicator={false}
        >
          {/* User Profile Section */}
          <View style={styles.profileSection}>
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              iterationDelay={3000}
              duration={2000}
              style={styles.avatarContainer}
            >
              <Avatar.Image
                source={{ uri: user.avatar }}
                size={80}
                style={styles.avatar}
              />
              <Badge style={styles.levelBadge}>{user.level}</Badge>
            </Animatable.View>
            
            <Animatable.View
              animation="fadeIn"
              duration={800}
              delay={300}
              style={styles.userInfo}
            >
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.pointsContainer}>
                <IconButton icon="star" size={16} color="#FFD700" style={styles.pointsIcon} />
                <Text style={styles.pointsText}>{user.points} points</Text>
              </View>
            </Animatable.View>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <IconButton icon="trophy" size={20} color="#FFFFFF" style={styles.statIcon} />
                <Text style={styles.statValue}>{user.starsEarned}</Text>
                <Text style={styles.statLabel}>Stars</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <IconButton icon="fire" size={20} color="#FFFFFF" style={styles.statIcon} />
                <Text style={styles.statValue}>{user.streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Navigation Items */}
          <View style={styles.menuSection}>
            {/* Custom drawer items with animations */}
            <Animatable.View animation="fadeInLeft" delay={500} duration={500}>
              <DrawerItem
                label={() => (
                  <View style={styles.menuItem}>
                    <IconButton icon="home" size={24} color="#FFFFFF" style={styles.menuIcon} />
                    <Text style={styles.menuText}>Home</Text>
                  </View>
                )}
                onPress={() => props.navigation.navigate('Welcome')}
                style={[
                  styles.drawerItem,
                  props.state.index === 0 ? styles.activeItem : null
                ]}
              />
            </Animatable.View>
            
            <Animatable.View animation="fadeInLeft" delay={600} duration={500}>
              <DrawerItem
                label={() => (
                  <View style={styles.menuItem}>
                    <IconButton icon="book-open-variant" size={24} color="#FFFFFF" style={styles.menuIcon} />
                    <Text style={styles.menuText}>Lessons</Text>
                    <Badge style={styles.newBadge}>5</Badge>
                  </View>
                )}
                onPress={() => props.navigation.navigate('AppFlow')}
                style={[
                  styles.drawerItem,
                  props.state.index === 1 ? styles.activeItem : null
                ]}
              />
            </Animatable.View>
            
            <Animatable.View animation="fadeInLeft" delay={700} duration={500}>
              <DrawerItem
                label={() => (
                  <View style={styles.menuItem}>
                    <IconButton icon="trophy-award" size={24} color="#FFFFFF" style={styles.menuIcon} />
                    <Text style={styles.menuText}>Leaderboard</Text>
                  </View>
                )}
                onPress={() => props.navigation.navigate('Leaderboard')}
                style={[
                  styles.drawerItem,
                  props.state.index === 2 ? styles.activeItem : null
                ]}
              />
            </Animatable.View>
            
            <Animatable.View animation="fadeInLeft" delay={800} duration={500}>
              <DrawerItem
                label={() => (
                  <View style={styles.menuItem}>
                    <IconButton icon="cog" size={24} color="#FFFFFF" style={styles.menuIcon} />
                    <Text style={styles.menuText}>Settings</Text>
                  </View>
                )}
                onPress={() => props.navigation.navigate('Settings')}
                style={[
                  styles.drawerItem,
                  props.state.index === 3 ? styles.activeItem : null
                ]}
              />
            </Animatable.View>
          </View>
          
          <Divider style={styles.divider} />
          
          {/* App logo and version */}
          <View style={styles.footerSection}>
            <Image source={hoopoeIcon} style={styles.logoImage} resizeMode="contain" />
            <Text style={styles.appName}>Hebrew Adventure</Text>
            <Text style={styles.versionText}>Version 1.2.0</Text>
          </View>
        </DrawerContentScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Simple Header Component that doesn't rely on scene.descriptor
function SimpleHeader({ navigation, route }) {
  return (
    <Animatable.View 
      animation="fadeIn" 
      duration={800} 
      style={styles.headerContainer}
    >
      <View style={styles.statusBarSpacing} />
      <LinearGradient
        colors={["#41B2EB", "#007AFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <IconButton
          icon="menu"
          color="#FFFFFF"
          size={28}
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
        />
        
        <Text style={styles.headerTitle}>{route.name}</Text>
        
        <View style={styles.headerRight}>
          <IconButton
            icon="bell"
            color="#FFFFFF"
            size={24}
            onPress={() => {}}
            style={styles.headerIcon}
          />
          <Badge style={styles.notificationBadge}>3</Badge>
        </View>
      </LinearGradient>
    </Animatable.View>
  );
}

export default function MainNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation, route }) => ({
        // Use SimpleHeader with navigation and route props directly
        header: () => <SimpleHeader navigation={navigation} route={route} />,
        drawerType: "front",
        drawerStyle: {
          width: '80%',
          maxWidth: 320,
          backgroundColor: 'transparent',
        },
        overlayColor: 'rgba(0,0,0,0.7)',
        swipeEdgeWidth: 100,
        drawerActiveTintColor: '#FFFFFF',
        drawerInactiveTintColor: 'rgba(255,255,255,0.8)',
      })}
    >
      <Drawer.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          title: "Home"
        }}
      />

      <Drawer.Screen
        name="AppFlow"
        component={AppStack}
        options={{
          headerShown: false,
          title: "Lessons"
        }}
      />

      <Drawer.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen}
      />
      
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
      />
    </Drawer.Navigator>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  statusBarSpacing: {
    height: Platform.OS === 'ios' ? 50 : 30, // Adjust these values as needed
    width: '100%',
    backgroundColor: 'transparent',
    
  },
  container: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 0,
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  avatar: {
    backgroundColor: '#FFFFFF',
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
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsIcon: {
    margin: 0, 
    padding: 0,
  },
  pointsText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 10,
  },
  statIcon: {
    margin: 0,
    padding: 0,
    marginBottom: -5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  divider: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    height: 1,
    marginVertical: 8,
  },
  menuSection: {
    flex: 1,
    paddingTop: 8,
  },
  drawerItem: {
    marginHorizontal: 0,
    marginVertical: 4,
  },
  activeItem: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  menuIcon: {
    margin: 0,
    padding: 0,
    marginRight: -4,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    flex: 1,
  },
  newBadge: {
    backgroundColor: '#DE8A2C',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  footerSection: {
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  logoImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  headerContainer: {
    width: '100%',
    zIndex: 1000,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerGradient: {
    textAlign:"center",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin:"auto",
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  menuButton: {
    margin: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    margin:"auto" // To center the title when the menu icon is on the left
  },
  headerRight: {
    position: 'relative',
    width: 40,
  },
  headerIcon: {
    margin: 0,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#DE8A2C',
    color: '#FFFFFF',
    size: 18,
  },
});