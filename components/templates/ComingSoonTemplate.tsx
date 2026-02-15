import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet, Image, ImageBackground, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";

import { Images } from "@/assets/images";
import { Text, Button } from "@/atoms";
import useColors from "@/hooks/useColors";
import { TopBar } from "@/molecules";
import { useTheme } from "@/utils/theme-engine";

const { height } = Dimensions.get("window");

interface ComingSoonTemplateProps {
    title: string;
    onBack?: () => void;
    onMenu?: () => void;
}

const ComingSoonTemplate: React.FC<ComingSoonTemplateProps> = ({
    title,
    onBack,
    onMenu,
}) => {
    const colors = useColors();
    const { theme } = useTheme();
    const router = useRouter();

    const handleGoHome = () => {
        if (onBack) {
            onBack();
        } else {
            router.replace("/(drawer)/lessons");
        }
    };

    return (
        <View style={styles.container}>
            <TopBar
                title={title}
                onMenu={onMenu}
                showBack={!!onBack}
                onBack={onBack}
                style={styles.absoluteHeader}
                titleColor="#FFFFFF"
                iconColor="#FFFFFF"
                hideShadow
            />

            <LinearGradient
                colors={[colors.blue6 as string, colors.blue7 as string]}
                style={StyleSheet.absoluteFill}
            />

            <ImageBackground
                source={Images.BackgroundPattern}
                style={styles.backgroundImage}
                imageStyle={styles.backgroundPattern}
            >
                <SafeAreaView style={styles.safe}>
                    <View style={styles.content}>
                        <Animatable.View
                            animation="bounceIn"
                            duration={1500}
                            style={styles.mascotContainer}
                        >
                            <View style={styles.mascotCircle}>
                                <Image
                                    source={Images.HoopoeBanner}
                                    style={styles.mascot}
                                    resizeMode="contain"
                                />
                            </View>
                        </Animatable.View>

                        <Animatable.View
                            animation="fadeInUp"
                            delay={500}
                            style={styles.textContainer}
                        >
                            <Text variant="h1" style={[theme.styles.headingL, styles.mainTitle]}>
                                Coming Soon!
                            </Text>
                            <Text variant="body" style={styles.subtitle}>
                                This feature will be developed soon. Stay tuned for more Hebrew adventures!
                            </Text>
                        </Animatable.View>

                        <Animatable.View
                            animation="fadeInUp"
                            delay={800}
                            style={styles.buttonContainer}
                        >
                            <Button
                                mode="contained"
                                onPress={handleGoHome}
                                style={[styles.button, { backgroundColor: colors.amber6 as string }]}
                                labelStyle={styles.buttonLabel}
                            >
                                Go back to Home
                            </Button>
                        </Animatable.View>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    absoluteHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        zIndex: 10,
    },
    backgroundImage: {
        flex: 1,
    },
    backgroundPattern: {
        opacity: 0.1,
        tintColor: "#FFFFFF",
    },
    safe: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    mascotContainer: {
        marginBottom: 40,
    },
    mascotCircle: {
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
    },
    mascot: {
        width: 180,
        height: 180,
    },
    textContainer: {
        alignItems: "center",
        marginBottom: 48,
    },
    mainTitle: {
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 16,
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        color: "rgba(255, 255, 255, 0.9)",
        textAlign: "center",
        fontSize: 18,
        lineHeight: 26,
        paddingHorizontal: 20,
    },
    buttonContainer: {
        width: "100%",
        maxWidth: 300,
    },
    button: {
        paddingVertical: 8,
        borderRadius: 12,
        elevation: 4,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});

export default ComingSoonTemplate;
