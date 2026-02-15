import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View, Pressable, StyleProp, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text, Icon } from "@/atoms";

interface TopBarProps {
    title: string;
    showBack?: boolean;
    onBack?: () => void;
    onMenu?: () => void;
    style?: StyleProp<ViewStyle>;
    titleColor?: string;
    iconColor?: string;
    hideShadow?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
    title,
    showBack = false,
    onBack,
    onMenu,
    style,
    titleColor = "#333",
    iconColor = "#333",
    hideShadow = false,
}) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <View style={[
            styles.container,
            { paddingTop: insets.top },
            hideShadow && { elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
            style
        ]}>
            <View style={styles.content}>
                <View style={styles.left}>
                    {showBack ? (
                        <Icon
                            icon="arrow-left"
                            size={24}
                            onPress={handleBack}
                            iconColor={iconColor}
                        />
                    ) : (
                        <Icon icon="menu" size={24} onPress={onMenu} iconColor={iconColor} />
                    )}
                </View>

                <View style={styles.center}>
                    <Text variant="h3" style={[styles.title, { color: titleColor }]} numberOfLines={1}>
                        {title}
                    </Text>
                </View>

                <View style={styles.right}>
                    {/* Placeholder for right-side actions like Profile or Notifications */}
                    <View style={{ width: 40 }} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    content: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
    },
    left: {
        width: 48,
        alignItems: "center",
    },
    center: {
        flex: 1,
        alignItems: "center",
    },
    right: {
        width: 48,
        alignItems: "center",
    },
    title: {
        fontWeight: "bold",
        color: "#333",
    },
});

export default TopBar;
