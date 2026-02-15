import { useNavigation } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";

import { ComingSoonTemplate } from "@/templates";

export default function SettingsScreen() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <ComingSoonTemplate
      title="Settings"
      onMenu={() => navigation.openDrawer()}
    />
  );
}
