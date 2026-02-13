import React from "react";
import {
  Text as RNText,
  TextStyle,
  StyleSheet,
  TextProps as RNTextProps,
} from "react-native";

import useColors from "@/hooks/useColors";

interface TextProps extends RNTextProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "label" | "caption";
  children: React.ReactNode;
  color?: string;
  style?: TextStyle;
}

const Text: React.FC<TextProps> = ({
  variant = "body",
  children,
  color,
  style,
  ...props
}) => {
  const colors = useColors();

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case "h1":
        return { fontSize: 32, fontWeight: "bold" };
      case "h2":
        return { fontSize: 24, fontWeight: "bold" };
      case "h3":
        return { fontSize: 20, fontWeight: "bold" };
      case "h4":
        return { fontSize: 18, fontWeight: "bold" };
      case "body":
        return { fontSize: 16 };
      case "label":
        return { fontSize: 16, fontWeight: "500" };
      case "caption":
        return { fontSize: 14 };
      default:
        return { fontSize: 16 };
    }
  };

  return (
    <RNText
      style={[
        getVariantStyle(),
        { color: color || colors.contentPrimary },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Text;
