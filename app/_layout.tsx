import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SessionProvider, useSession } from "@/context/SessionProvider";
import { portal1 } from "@/utils/theme";
import { ThemeProvider } from "@/utils/theme-engine";

const queryClient = new QueryClient();

function InitialLayout() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inDrawerGroup = segments[0] === "(drawer)";
    const isWelcomeScreen = inDrawerGroup && (segments.length <= 1 || (segments as string[])[1] === "index");

    if (!session) {
      // If not logged in and not in auth group, redirect to login
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
    } else {
      // If logged in and in auth group, redirect to dashboard/lessons
      if (inAuthGroup) {
        router.replace("/(drawer)/lessons");
      }
    }
  }, [session, isLoading, segments]);

  if (isLoading) {
    return null; // Or a tailored splash screen
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        {!session ? (
          <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
        ) : (
          <>
            <Stack.Screen name="(drawer)" options={{ animation: "fade" }} />
            <Stack.Screen name="exercises/[id]" options={{ animation: "slide_from_right" }} />
          </>
        )}
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={portal1.lightTheme}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <InitialLayout />
          </SessionProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
