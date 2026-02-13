import { useRouter } from "expo-router";
import React from "react";

import { useSession } from "@/hooks/Auth/useSession";
import { WelcomeTemplate } from "@/templates";
import { AppRoutes } from "@/utils/constants/routes";

export default function WelcomeScreen() {
  const { session, signIn } = useSession();
  const router = useRouter();

  return (
    <WelcomeTemplate
      user={session}
      onContinueLearning={() => router.push(AppRoutes.DRAWER.LESSONS as never)}
      onTryDemo={() =>
        router.push(AppRoutes.EXERCISES.DETAILS("story_123") as never)
      }
      onSignInDemo={() => signIn("demo@example.com")}
    />
  );
}
