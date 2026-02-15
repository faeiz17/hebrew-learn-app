import React from "react";
import { StyleSheet, View } from "react-native";
import { Card } from "react-native-paper";

import { Text, Icon } from "@/atoms";
import { Story } from "@/types";
import { useTheme } from "@/utils/theme-engine";
import useColors from "@/hooks/useColors";

interface StoryCardProps {
    story: Story;
    onPress: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onPress }) => {
    const { theme } = useTheme();
    const colors = useColors();

    return (
        <Card
            style={[styles.card, theme.styles.cardShadow, { borderRadius: theme.radius[200] }]}
            onPress={onPress}
        >
            <Card.Content style={styles.content}>
                <View style={styles.header}>
                    <Text variant="h3" style={[theme.styles.headingM, styles.titleHebrew]}>
                        {story.titleHebrew}
                    </Text>
                    <View style={[styles.badge, styles[story.level]]}>
                        <Text style={styles.badgeText}>{story.level.toUpperCase()}</Text>
                    </View>
                </View>
                <Text variant="body" style={[theme.styles.labelS, styles.titleEnglish]}>
                    {story.titleEnglish}
                </Text>
            </Card.Content>
            <Card.Actions style={styles.actions}>
                <View style={styles.startAction}>
                    <Text variant="caption" style={[styles.startText, { color: colors.blue7 as string }]}>
                        Read Full Story
                    </Text>
                    <Icon icon="chevron-right" size={20} iconColor={colors.blue7 as string} />
                </View>
            </Card.Actions>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        backgroundColor: "#FFFFFF",
    },
    content: {
        paddingBottom: 8,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    titleHebrew: {
        fontSize: 22,
        color: "#333",
    },
    titleEnglish: {
        color: "#666",
        fontStyle: "italic",
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    easy: {
        backgroundColor: "#E8F5E9",
    },
    medium: {
        backgroundColor: "#FFF3E0",
    },
    hard: {
        backgroundColor: "#FFEBEE",
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#666",
    },
    actions: {
        justifyContent: "flex-end",
        paddingRight: 12,
        paddingBottom: 12,
    },
    startAction: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    startText: {
        fontWeight: "bold",
    },
});

export default StoryCard;
