import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React from "react";

import { useSession } from "@/hooks/Auth/useSession";
import { WelcomeTemplate } from "@/templates";

export default function WelcomeScreen() {
  const { session } = useSession();
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <WelcomeTemplate
      user={session}
      onContinueLearning={() => router.push("/(drawer)/lessons")}
      onTryDemo={() =>
        router.push("/exercises/story_123")
      }
      onLogin={() => router.push("/(auth)/login")}
      onRegister={() => router.push("/(auth)/register")}
      onMenu={() => navigation.openDrawer()}
    />
  );
}
