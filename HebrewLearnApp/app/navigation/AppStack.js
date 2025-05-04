import React from "react";
import { View, Platform, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, IconButton, Badge } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";

// Screens for this stack
import LevelsScreen from "../screens/Home/LevelsScreen";
import StoryScreen from "../screens/Home/StoryScreen";
import ExerciseScreen from "../screens/Home/ExerciseScreen";

const Stack = createStackNavigator();

// Simplified header that doesn't rely on scene.descriptor
function SimpleStackHeader({ navigation, route, back }) {
  // Use the route name directly instead of scene.descriptor.options
  const title = route.name;
  
  // Customize title display based on route name
  let displayTitle = title;
  if (title === "Levels") {
    displayTitle = "Choose Your Level";
  } else if (title === "Story") {
    displayTitle = "Story Time";
  } else if (title === "Exercise") {
    displayTitle = "Practice Time";
  }

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
        {back ? (
          <IconButton
            icon="arrow-left"
            color="#FFFFFF"
            size={28}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        ) : (
          <IconButton
            icon="menu"
            color="#FFFFFF"
            size={28}
            onPress={() => navigation.openDrawer()}
            style={styles.menuButton}
          />
        )}
        
        <Text style={styles.headerTitle}>{displayTitle}</Text>
        
        <View style={styles.headerRight}>
          {title === "Levels" && (
            <View style={styles.levelBadges}>
             
              <IconButton
                icon="star-outline"
                color="#FFFFFF"
                size={24}
                style={styles.headerIcon}
              />
            </View>
          )}
          
          {title === "Story" && (
            <IconButton
              icon="book-open-page-variant"
              color="#FFFFFF"
              size={24}
              style={styles.headerIcon}
            />
          )}
          
          {title === "Exercise" && (
            <View style={styles.timerContainer}>
              <IconButton
                icon="timer-outline"
                color="#FFFFFF"
                size={24}
                style={styles.headerIcon}
              />
              <Text style={styles.timerText}>2:30</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </Animatable.View>
  );
}

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route, back }) => ({
        // Use SimpleStackHeader directly with navigation, route, and back props
        header: (props) => (
          <SimpleStackHeader 
            navigation={navigation}
            route={route}
            back={back}
          />
        ),
        // Hide the default header shadow
        headerShadowVisible: false,
        // Add transition animations
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      })}
    >
      {/* Levels is our initial screen in this stack */}
      <Stack.Screen 
        name="Levels" 
        component={LevelsScreen} 
      />
      
      {/* Story screen with custom transition */}
      <Stack.Screen 
        name="Story" 
        component={StoryScreen} 
        options={{
          // Optional custom animation for this specific screen
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    scale: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            };
          },
        }}
      />
      
      {/* Exercise screen */}
      <Stack.Screen 
        name="Exercise" 
        component={ExerciseScreen} 
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  statusBarSpacing: {
    height: Platform.OS === 'ios' ? 50 : 30, // Adjust these values as needed
    width: '100%',
    backgroundColor: 'transparent',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  backButton: {
    margin: 0,
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
    marginLeft: 40, // To center the title when there are icons on the sides
  },
  headerRight: {
    width: 60, // Fixed width for the right side of the header
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },


  

  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: -8,
  }
});