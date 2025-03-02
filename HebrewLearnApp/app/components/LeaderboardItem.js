// app/components/LeaderboardItem.js
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { Card, Avatar } from "react-native-paper";

export default function LeaderboardItem({ item, index }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, index]);

  // Determine avatar style for the top 3 positions
  let avatarIcon = "account";
  let avatarColor = "#3b82f6";
  if (index === 0) {
    avatarIcon = "trophy";
    avatarColor = "#FFD700"; // Gold
  } else if (index === 1) {
    avatarIcon = "trophy";
    avatarColor = "#C0C0C0"; // Silver
  } else if (index === 2) {
    avatarIcon = "trophy";
    avatarColor = "#CD7F32"; // Bronze
  }

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Card style={styles.cardItem}>
        <Card.Title
          title={`${index + 1}. ${item.name}`}
          subtitle={`Score: ${item.score}`}
          left={() => (
            <Avatar.Icon
              icon={avatarIcon}
              size={40}
              style={[styles.avatar, { backgroundColor: avatarColor }]}
            />
          )}
        />
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardItem: {
    marginVertical: 6,
    borderRadius: 8,
    elevation: 3,
  },
  avatar: {
    backgroundColor: "#3b82f6",
  },
});
