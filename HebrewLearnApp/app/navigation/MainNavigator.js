// app/navigation/MainNavigator.js
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
// Screens for the drawer
import WelcomeScreen from "../screens/Home/WelcomeScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import SettingsScreen from "../screens/SettingsScreen";

// Our new stack that includes Levels -> Story -> Exercise
import AppStack from "./AppStack";

const Drawer = createDrawerNavigator();

export default function MainNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#3b82f6" },
        headerTintColor: "#fff",
      }}
    >
      {/* Drawer items you DO want visible: */}
      <Drawer.Screen name="Welcome" component={WelcomeScreen} />

      {/* Instead of referencing Levels, Story, or Exercise directly,
          we reference the AppStack that nests them. */}
      <Drawer.Screen
        name="AppFlow"
        component={AppStack}
        options={{
          headerShown: false,
          drawerLabel: "Levels", // Show "Levels" in the drawer
        }}
      />

      <Drawer.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
