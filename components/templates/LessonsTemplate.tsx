import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    StyleSheet,
    FlatList,
    View,
    ActivityIndicator,
    ScrollView,
    Dimensions,
    ImageBackground
} from "react-native";
import * as Animatable from "react-native-animatable";

import { Images } from "@/assets/images";
import { Text, Button, Icon } from "@/atoms";
import { StoryCard, TopBar } from "@/molecules";
import { Story } from "@/types";
import { useTheme } from "@/utils/theme-engine";
import useColors from "@/hooks/useColors";

const { height } = Dimensions.get("window");

interface LessonsTemplateProps {
    stories: Story[] | undefined;
    isLoading: boolean;
    onStoryPress: (id: string) => void;
    onMenu: () => void;
}

const LessonsTemplate: React.FC<LessonsTemplateProps> = ({
    stories,
    isLoading,
    onStoryPress,
    onMenu,
}) => {
    const { theme } = useTheme();
    const colors = useColors();
    const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);

    const expandedStory = stories?.find(s => s._id === expandedStoryId);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.blue6 as string} />
            </View>
        );
    }

    const renderHeader = () => (
        <View style={styles.header}>
            <Text variant="h2" style={[theme.styles.headingM, styles.whiteText]}>Select a Story</Text>
            <Text variant="body" style={[theme.styles.labelS, styles.whiteText, styles.listSubtitle]}>
                Pick a story and start your daily practice!
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.blue6 as string, colors.blue7 as string]}
                style={StyleSheet.absoluteFill}
            />

            <ImageBackground
                source={Images.BackgroundPattern}
                style={styles.backgroundImage}
                imageStyle={styles.backgroundPattern}
            >
                {expandedStory ? (
                    <ScrollView
                        contentContainerStyle={[styles.expandedContent, { paddingTop: height * 0.12 }]}
                        showsVerticalScrollIndicator={false}
                    >
                        <Animatable.View animation="fadeInUp" duration={800}>
                            <View style={styles.expandedHeader}>
                                <Text variant="h1" style={[theme.styles.headingL, styles.whiteText]}>
                                    {expandedStory.titleHebrew}
                                </Text>
                                <Text variant="body" style={[theme.styles.labelM, styles.whiteText, styles.subtitle]}>
                                    {expandedStory.titleEnglish}
                                </Text>
                            </View>

                            <Animatable.View
                                animation="fadeIn"
                                delay={400}
                                style={[styles.storyCard, { borderRadius: theme.radius[300] }]}
                            >
                                <Text variant="h2" style={styles.hebrewContent}>
                                    {expandedStory.contentHebrew}
                                </Text>

                                {expandedStory.transliteration && (
                                    <Text variant="body" style={styles.transliteration}>
                                        {expandedStory.transliteration}
                                    </Text>
                                )}

                                <View style={styles.divider} />

                                <Text variant="body" style={styles.englishContent}>
                                    {expandedStory.contentEnglish}
                                </Text>
                            </Animatable.View>

                            <Button
                                mode="contained"
                                onPress={() => onStoryPress(expandedStory._id)}
                                style={[styles.beginButton, { backgroundColor: colors.amber6 as string }]}
                                labelStyle={styles.beginButtonLabel}
                            >
                                Begin Exercise
                            </Button>
                        </Animatable.View>
                    </ScrollView>
                ) : (
                    <FlatList
                        data={stories}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <Animatable.View animation="fadeInUp">
                                <StoryCard story={item} onPress={() => setExpandedStoryId(item._id)} />
                            </Animatable.View>
                        )}
                        contentContainerStyle={[styles.listContent, { paddingTop: height * 0.12 }]}
                        ListHeaderComponent={renderHeader}
                        ListEmptyComponent={
                            <View style={styles.center}>
                                <Text variant="body" style={styles.whiteText}>No stories found. Please try again later.</Text>
                            </View>
                        }
                    />
                )}
            </ImageBackground>

            <TopBar
                title={expandedStory ? "Read Story" : "Lessons"}
                showBack={!!expandedStory}
                onBack={() => setExpandedStoryId(null)}
                onMenu={onMenu}
                style={styles.absoluteHeader}
                titleColor="#FFFFFF"
                iconColor="#FFFFFF"
                hideShadow
            />
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
        zIndex: 10,
        backgroundColor: "transparent",
        borderBottomWidth: 0,
    },
    backgroundImage: {
        flex: 1,
    },
    backgroundPattern: {
        opacity: 0.08,
        tintColor: "#FFFFFF",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    listContent: {
        padding: 24,
        paddingTop: height * 0.12,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 24,
    },
    listSubtitle: {
        marginTop: 4,
    },
    expandedContent: {
        flexGrow: 1,
        padding: 24,
        paddingTop: height * 0.12,
        paddingBottom: 40,
    },
    expandedHeader: {
        alignItems: "center",
        marginBottom: 32,
    },
    whiteText: {
        color: "#FFFFFF",
        textAlign: "center",
    },
    subtitle: {
        opacity: 0.9,
        marginTop: 8,
        fontStyle: "italic",
    },
    storyCard: {
        backgroundColor: "#FFFFFF",
        padding: 24,
        marginBottom: 32,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    hebrewContent: {
        fontSize: 28,
        textAlign: "right",
        lineHeight: 42,
        color: "#333",
        marginBottom: 8,
    },
    transliteration: {
        textAlign: "right",
        color: "#666",
        fontSize: 14,
        marginBottom: 16,
        fontStyle: "italic",
    },
    divider: {
        height: 1,
        backgroundColor: "#F0F0F0",
        marginVertical: 20,
    },
    englishContent: {
        fontSize: 18,
        color: "#444",
        lineHeight: 26,
    },
    beginButton: {
        paddingVertical: 8,
        borderRadius: 12,
        elevation: 4,
    },
    beginButtonLabel: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});

export default LessonsTemplate;
