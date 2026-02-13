import { View, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import * as Animatable from "react-native-animatable";
import { Surface, RadioButton } from "react-native-paper";

import { Text } from "@/atoms";

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
  let borderColor = "#e0e0e0";
  let backgroundColor = "#FFFFFF";
  let radioColor = "#41B2EB";

  if (isSelected) {
    borderColor = "#41B2EB";
    backgroundColor = "rgba(65, 178, 235, 0.1)";
  }

  if (showFeedback && isSelected) {
    if (isCorrect) {
      borderColor = "#4CAF50";
      backgroundColor = "rgba(76, 175, 80, 0.1)";
      radioColor = "#4CAF50";
    } else {
      borderColor = "#F44336";
      backgroundColor = "rgba(244, 67, 54, 0.1)";
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
        <Surface style={[styles.container, { borderColor, backgroundColor }]}>
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
