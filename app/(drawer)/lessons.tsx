import React from "react";
import { View, StyleSheet } from "react-native";

import Text from "@/atoms/Text";

export default function LessonsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="h1">Lessons</Text>
      <Text variant="body">Start learning here!</Text>
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
