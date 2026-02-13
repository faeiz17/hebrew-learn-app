import { Drawer } from "expo-router/drawer";
import { useWindowDimensions } from "react-native";

import { useSession } from "@/hooks/Auth/useSession";
import { DrawerContent } from "@/organisms";

export default function DrawerLayout() {
  const { session } = useSession();
  const dimensions = useWindowDimensions();

  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} user={session} />}
      screenOptions={{
        headerShown: false,
        drawerType: dimensions.width >= 768 ? "permanent" : "front",
        drawerStyle: {
          width: "80%",
          maxWidth: 320,
          backgroundColor: "transparent",
        },
        overlayColor: "rgba(0,0,0,0.7)",
        drawerActiveTintColor: "#FFFFFF",
        drawerInactiveTintColor: "rgba(255,255,255,0.8)",
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "Home",
        }}
      />
      <Drawer.Screen
        name="lessons"
        options={{
          drawerLabel: "Lessons",
          title: "Lessons",
        }}
      />
      <Drawer.Screen
        name="leaderboard"
        options={{
          drawerLabel: "Leaderboard",
          title: "Leaderboard",
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Settings",
          title: "Settings",
        }}
      />
    </Drawer>
  );
}
