import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, usePathname } from "expo-router";
import React from "react";
import { View, StyleSheet, Image, Platform } from "react-native";
import * as Animatable from "react-native-animatable";
import { Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { Images } from "@/assets/images";
import { Text, Icon, Button } from "@/atoms";
import { useSession } from "@/hooks/Auth/useSession";
import useColors from "@/hooks/useColors";
import { UserInfo } from "@/molecules";
import { AppRoutes } from "@/utils/constants/routes";

interface DrawerContentProps extends DrawerContentComponentProps {
  user: any; // Using any to avoid strict type issues for now, or import User type
}

// Assets
const hoopoeIcon = Images.HoopoeLogin;

export default function DrawerContent(props: DrawerContentProps) {
  const { user, state, navigation } = props;
  const { session, signOut } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const colors = useColors();

  return (
    <LinearGradient
      colors={["#41B2EB", "#0072FF"]}
      style={styles.container}
    >
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.flexOne}>
          {/* Top Section: User & Stats */}
          {user && (
            <View style={styles.profileSection}>
              <UserInfo user={user} />
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Icon icon="trophy" size={20} iconColor="#FFD700" />
                  <Text variant="h3" style={styles.statValue}>{user.xp || 0}</Text>
                  <Text variant="caption" style={styles.statLabel}>XP</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Icon icon="fire" size={20} iconColor="#FF4500" />
                  <Text variant="h3" style={styles.statValue}>{user.dailyStreak || 0}</Text>
                  <Text variant="caption" style={styles.statLabel}>Streak</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Icon icon="star" size={20} iconColor="#FFEB3B" />
                  <Text variant="h3" style={styles.statValue}>{user.highestUnlockedLevel || 1}</Text>
                  <Text variant="caption" style={styles.statLabel}>Level</Text>
                </View>
              </View>
            </View>
          )}

          <Divider style={styles.divider} />

          {/* Middle Section: Navigation Items */}
          <View style={styles.menuSection}>
            <Animatable.View animation="fadeInLeft" delay={100} duration={400}>
              <DrawerItem
                label="Home"
                icon={({ color, size }) => <Icon icon="home" size={size} iconColor="#FFF" />}
                labelStyle={styles.menuText}
                onPress={() => navigation.navigate(AppRoutes.DRAWER.HOME as never)}
                style={[styles.drawerItem, state.index === 0 && styles.activeItem]}
              />
            </Animatable.View>

            <Animatable.View animation="fadeInLeft" delay={200} duration={400}>
              <DrawerItem
                label="Lessons"
                icon={({ color, size }) => <Icon icon="book-open-variant" size={size} iconColor="#FFF" />}
                labelStyle={styles.menuText}
                onPress={() => navigation.navigate(AppRoutes.DRAWER.LESSONS as never)}
                style={[styles.drawerItem, state.index === 1 && styles.activeItem]}
              />
            </Animatable.View>

            <Animatable.View animation="fadeInLeft" delay={300} duration={400}>
              <DrawerItem
                label="Leaderboard"
                icon={({ color, size }) => <Icon icon="trophy-outline" size={size} iconColor="#FFF" />}
                labelStyle={styles.menuText}
                onPress={() => navigation.navigate(AppRoutes.DRAWER.LEADERBOARD as never)}
                style={[styles.drawerItem, state.index === 2 && styles.activeItem]}
              />
            </Animatable.View>

            <Animatable.View animation="fadeInLeft" delay={400} duration={400}>
              <DrawerItem
                label="Settings"
                icon={({ color, size }) => <Icon icon="cog-outline" size={size} iconColor="#FFF" />}
                labelStyle={styles.menuText}
                onPress={() => navigation.navigate(AppRoutes.DRAWER.SETTINGS as never)}
                style={[styles.drawerItem, state.index === 3 && styles.activeItem]}
              />
            </Animatable.View>
          </View>

          {/* Push the bottom section to the bottom */}
          <View style={{ flex: 1 }} />

          {/* Bottom Section: Logout & Footer */}
          <View style={styles.bottomSection}>
            <Divider style={styles.divider} />
            <DrawerItem
              label="Logout"
              icon={({ color, size }) => <Icon icon="logout" size={size} iconColor="rgba(255,255,255,0.7)" />}
              labelStyle={styles.logoutText}
              onPress={() => signOut()}
              style={styles.drawerItem}
            />

            <View style={styles.footerSection}>
              <Image source={hoopoeIcon} style={styles.logoImage} resizeMode="contain" />
              <Text variant="h3" style={styles.appName}>Hebrew Adventure</Text>
              <Text variant="caption" style={styles.versionText}>
                Version {Constants.expoConfig?.version || "1.0.0"}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </DrawerContentScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  drawerContent: {
    flexGrow: 1,
    paddingTop: 50,
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingTop: 4,
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: "10%",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  statValue: {
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 2,
    fontSize: 18,
  },
  statLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  divider: {
    backgroundColor: "rgba(255,255,255,0.2)",
    height: 1,
    marginVertical: 4,
  },
  menuSection: {
    paddingTop: 8,
  },
  drawerItem: {
    marginHorizontal: 12,
    marginVertical: 1,
    borderRadius: 12,
    paddingVertical: 2,
  },
  activeItem: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  menuText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: -16,
  },
  logoutText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: -16,
  },
  bottomSection: {
    paddingBottom: 20,
    marginTop: "auto",
  },
  footerSection: {
    paddingTop: 12,
    paddingBottom: 16,
    alignItems: "center",
  },
  logoImage: {
    width: 44,
    height: 44,
    marginBottom: 12,
  },
  appName: {
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 2,
  },
  versionText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },
});
