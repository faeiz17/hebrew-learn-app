import React from "react";
import { View, StyleSheet } from "react-native";

import Text from "@/atoms/Text";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="h1">Settings</Text>
      <Text variant="body">Adjust your preferences.</Text>
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
