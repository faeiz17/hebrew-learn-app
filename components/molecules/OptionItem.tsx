import { View, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import * as Animatable from "react-native-animatable";
import { Surface, RadioButton } from "react-native-paper";

import { Text } from "@/atoms";
import { useTheme } from "@/utils/theme-engine";
import useColors from "@/hooks/useColors";

interface OptionItemProps {
  id: string;
  hebrew: string;
  english: string;
  isSelected: boolean;
  isCorrect?: boolean;
  showFeedback?: boolean;
  onSelect: (id: string) => void;
  style?: ViewStyle;
}

const OptionItem: React.FC<OptionItemProps> = ({
  id,
  hebrew,
  english,
  isSelected,
  isCorrect,
  showFeedback,
  onSelect,
  style,
}) => {
  const { theme } = useTheme();
  const colors = useColors();

  let borderColor = "#e0e0e0";
  let backgroundColor = "#FFFFFF";
  let radioColor = colors.blue6 as string;

  if (isSelected) {
    borderColor = colors.blue6 as string;
    backgroundColor = "rgba(65, 178, 235, 0.05)";
  }

  if (showFeedback && isSelected) {
    if (isCorrect) {
      borderColor = "#4CAF50";
      backgroundColor = "rgba(76, 175, 80, 0.08)";
      radioColor = "#4CAF50";
    } else {
      borderColor = "#F44336";
      backgroundColor = "rgba(244, 67, 54, 0.08)";
      radioColor = "#F44336";
    }
  }

  return (
    <Animatable.View animation="fadeInUp" duration={500} style={style}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelect(id)}
        disabled={showFeedback}
      >
        <Surface style={[
          styles.container,
          { borderColor, backgroundColor, borderRadius: theme.radius[200] }
        ]}>
          <View style={styles.radioContainer}>
            <RadioButton.Android
              value={id}
              status={isSelected ? "checked" : "unchecked"}
              color={radioColor}
              onPress={() => onSelect(id)}
              disabled={showFeedback}
            />
          </View>
          <View style={styles.textContainer}>
            <Text variant="h3" style={styles.hebrewText}>
              {hebrew}
            </Text>
            <Text variant="body" style={styles.englishText}>
              {english}
            </Text>
          </View>
        </Surface>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
  },
  radioContainer: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  hebrewText: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  englishText: {
    color: "#666",
  },
});

export default OptionItem;
