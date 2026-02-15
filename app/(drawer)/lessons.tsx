import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import React from "react";

import { useStories } from "@/hooks/Stories";
import { LessonsTemplate } from "@/templates";
import { AppRoutes } from "@/utils/constants/routes";

export default function LessonsScreen() {
  const { data: stories, isLoading } = useStories();
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const handleStoryPress = (id: string) => {
    router.push(AppRoutes.EXERCISES.DETAILS(id) as never);
  };

  const handleMenuPress = () => {
    navigation.openDrawer();
  };

  return (
    <LessonsTemplate
      stories={stories}
      isLoading={isLoading}
      onStoryPress={handleStoryPress}
      onMenu={handleMenuPress}
    />
  );
}

