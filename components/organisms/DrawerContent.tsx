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
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.drawerContent}
          showsVerticalScrollIndicator={false}
        >
          {/* User Profile Section */}
          {user && (
            <View style={styles.profileSection}>
              <UserInfo user={user} />

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Icon
                    icon="trophy"
                    size={20}
                    iconColor="#FFFFFF"
                    style={styles.statIcon}
                  />
                  <Text variant="h3" style={styles.statValue}>
                    {user.starsEarned}
                  </Text>
                  <Text variant="caption" style={styles.statLabel}>
                    Stars
                  </Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Icon
                    icon="fire"
                    size={20}
                    iconColor="#FFFFFF"
                    style={styles.statIcon}
                  />
                  <View style={styles.userInfo}>
                    <Text variant="h4">{user?.name || "Guest"}</Text>
                    <Text
                      variant="caption"
                      style={{ color: colors.contentSecondary }}
                    >
                      {user?.email || "Sign in to save progress"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          <Divider style={styles.divider} />

          {/* Navigation Items */}
          <View style={styles.menuSection}>
            {/* Custom drawer items with animations */}
            <Animatable.View animation="fadeInLeft" delay={500} duration={500}>
              <DrawerItem
                label={() => (
                  <View style={styles.menuItem}>
                    <Icon
                      icon="home"
                      size={24}
                      iconColor="#FFFFFF"
                      style={styles.menuIcon}
                    />
                    <Text variant="body" style={styles.menuText}>
                      Home
                    </Text>
                  </View>
                )}
                onPress={() =>
                  navigation.navigate(AppRoutes.DRAWER.HOME as never)
                }
                style={[
                  styles.drawerItem,
                  state.index === 0 && styles.activeItem,
                ]}
              />
            </Animatable.View>

            <Animatable.View animation="fadeInLeft" delay={600} duration={500}>
              <DrawerItem
                label={() => (
                  <View style={styles.menuItem}>
                    <Icon
                      icon="book-open-variant"
                      size={24}
                      iconColor="#FFFFFF"
                      style={styles.menuIcon}
                    />
                    <Text variant="body" style={styles.menuText}>
                      Lessons
                    </Text>
                  </View>
                )}
                onPress={() =>
                  navigation.navigate(AppRoutes.DRAWER.LESSONS as never)
                }
                style={[
                  styles.drawerItem,
                  state.index === 1 && styles.activeItem,
                ]}
              />
            </Animatable.View>

            {/* Add more items similarly */}
          </View>

          <Divider style={styles.divider} />

          {/* App logo and version */}
          <View style={styles.footerSection}>
            <Image
              source={hoopoeIcon}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text variant="h3" style={styles.appName}>
              Hebrew Adventure
            </Text>
            <Text variant="caption" style={styles.versionText}>
              Version {Constants.expoConfig?.version || "1.0.0"}
            </Text>
          </View>
        </DrawerContentScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 0,
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 8,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 10,
  },
  statIcon: {
    margin: 0,
    padding: 0,
    marginBottom: -5,
  },
  statValue: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
  },
  userInfo: {
    alignItems: "flex-start",
    marginLeft: 12,
  },
  divider: {
    backgroundColor: "rgba(255,255,255,0.2)",
    height: 1,
    marginVertical: 8,
  },
  menuSection: {
    flex: 1,
    paddingTop: 8,
  },
  drawerItem: {
    marginHorizontal: 0,
    marginVertical: 4,
  },
  activeItem: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
  },
  menuIcon: {
    margin: 0,
    padding: 0,
    marginRight: -4,
  },
  menuText: {
    color: "#FFFFFF",
    flex: 1,
  },
  footerSection: {
    padding: 16,
    alignItems: "center",
    marginTop: "auto",
  },
  logoImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  appName: {
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  versionText: {
    color: "rgba(255,255,255,0.6)",
  },
});
