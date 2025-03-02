// app/screens/LeaderboardScreen.js
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import LeaderboardItem from "../components/LeaderboardItem";

export default function LeaderboardScreen() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    // Simulate fetching leaderboard data
    const dummyLeaders = [
      { id: "1", name: "User A", score: 200 },
      { id: "2", name: "User B", score: 150 },
      { id: "3", name: "User C", score: 100 },
      { id: "4", name: "User D", score: 90 },
      { id: "5", name: "User E", score: 80 },
    ];
    setLeaders(dummyLeaders);
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.headerText}>
        Leaderboard
      </Text>
      <FlatList
        data={leaders}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <LeaderboardItem item={item} index={index} />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  headerText: {
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "#3b82f6",
  },
  listContent: {
    paddingBottom: 20,
  },
});
