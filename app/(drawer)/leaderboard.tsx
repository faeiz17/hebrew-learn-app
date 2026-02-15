import { useNavigation } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";

import { ComingSoonTemplate } from "@/templates";

export default function LeaderboardScreen() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <ComingSoonTemplate
      title="Leaderboard"
      onMenu={() => navigation.openDrawer()}
    />
  );
}
