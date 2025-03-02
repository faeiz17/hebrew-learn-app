import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// Screens for this stack
import LevelsScreen from "../screens/Home/LevelsScreen";
import StoryScreen from "../screens/Home/StoryScreen";
import ExerciseScreen from "../screens/Home/ExerciseScreen";

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#3b82f6" },
        headerTintColor: "#fff",
      }}
    >
      {/* Levels is our initial screen in this stack */}
      <Stack.Screen name="Levels" component={LevelsScreen} />
      {/* These are not in the drawer, but we can navigate to them */}
      <Stack.Screen name="Story" component={StoryScreen} />
      <Stack.Screen name="Exercise" component={ExerciseScreen} />
    </Stack.Navigator>
  );
}
