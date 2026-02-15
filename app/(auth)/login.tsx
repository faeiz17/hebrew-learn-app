import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";

import { Images } from "@/assets/images";
import { Text, Button, Input } from "@/atoms";
import { useSession } from "@/hooks/Auth/useSession";
import useColors from "@/hooks/useColors";
import { AppRoutes } from "@/utils/constants/routes";
import { useTheme } from "@/utils/theme-engine";

const { height } = Dimensions.get("window");

export default function LoginScreen() {
    const { signIn } = useSession();
    const router = useRouter();
    const colors = useColors();
    const { theme } = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            await signIn(email, password);
            router.replace("/(drawer)/lessons");
        } catch (error) {
            Alert.alert("Login Failed", (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={[colors.blue6 as string, colors.blue7 as string]}
            style={styles.container}
        >
            <SafeAreaView style={styles.safe}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.flex}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Mascot Section */}
                        <Animatable.View
                            animation="bounceIn"
                            duration={1500}
                            style={styles.headerSection}
                        >
                            <Image
                                source={Images.HoopoeLogin}
                                style={styles.mascot}
                                resizeMode="contain"
                            />
                            <Animatable.View animation="fadeInUp" delay={500}>
                                <Text variant="h1" style={styles.title}>
                                    Hebrew Adventure
                                </Text>
                                <Text variant="body" style={styles.subtitle}>
                                    Sign in to continue your journey
                                </Text>
                            </Animatable.View>
                        </Animatable.View>

                        {/* Form Section */}
                        <Animatable.View
                            animation="fadeInUp"
                            delay={800}
                            style={[
                                styles.formCard,
                                { borderRadius: theme.radius[300], backgroundColor: colors.custom0 as string },
                            ]}
                        >
                            <View style={styles.form}>
                                <Input
                                    label="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    left={<PaperInput.Icon icon="email-outline" />}
                                />
                                <Input
                                    label="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    left={<PaperInput.Icon icon="lock-outline" />}
                                />

                                <Button
                                    mode="contained"
                                    onPress={handleLogin}
                                    loading={isLoading}
                                    style={[styles.button, { backgroundColor: colors.blue6 as string }]}
                                    labelStyle={styles.buttonLabel}
                                >
                                    Sign In
                                </Button>

                                <View style={styles.dividerContainer}>
                                    <View style={styles.divider} />
                                    <Text variant="caption" style={styles.orText}>OR</Text>
                                    <View style={styles.divider} />
                                </View>

                                <Button
                                    mode="outlined"
                                    onPress={() => router.push(AppRoutes.AUTH.REGISTER as any)}
                                    style={[styles.outlineButton, { borderColor: colors.amber6 as string }]}
                                    labelStyle={{ color: colors.amber6 as string }}
                                >
                                    Create Account
                                </Button>
                            </View>
                        </Animatable.View>

                        <View style={styles.footer}>
                            <Text variant="caption" style={styles.footerText}>
                                By signing in, you agree to our Terms & Privacy
                            </Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

// Dummy import for Paper Icon if not accessible via Input atom directly
import { TextInput as PaperInput } from "react-native-paper";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safe: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
        justifyContent: "center",
    },
    headerSection: {
        alignItems: "center",
        marginBottom: 32,
        marginTop: height * 0.05,
    },
    mascot: {
        width: 140,
        height: 140,
        marginBottom: 16,
    },
    title: {
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "bold",
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        color: "rgba(255, 255, 255, 0.9)",
        textAlign: "center",
        marginTop: 4,
    },
    formCard: {
        padding: 24,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    form: {
        gap: 16,
    },
    button: {
        marginTop: 8,
        paddingVertical: 8,
        borderRadius: 12,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: "600",
    },
    outlineButton: {
        borderRadius: 12,
        borderWidth: 2,
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    orText: {
        marginHorizontal: 16,
        color: "#999",
        fontWeight: "bold",
    },
    footer: {
        marginTop: 32,
        alignItems: "center",
    },
    footerText: {
        color: "rgba(255, 255, 255, 0.7)",
        textAlign: "center",
    },
});
