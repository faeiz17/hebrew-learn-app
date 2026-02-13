import React from "react";
import { View, StyleSheet } from "react-native";

import Text from "@/atoms/Text";

export default function LeaderboardScreen() {
  return (
    <View style={styles.container}>
      <Text variant="h1">Leaderboard</Text>
      <Text variant="body">Coming Soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
