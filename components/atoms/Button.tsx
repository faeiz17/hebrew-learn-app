import React from "react";
import { StyleSheet, ViewStyle, StyleProp } from "react-native";
import {
  Button as PaperButton,
  ButtonProps as PaperButtonProps,
} from "react-native-paper";

interface ButtonProps extends PaperButtonProps {
  mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal";
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  mode = "contained",
  style,
  children,
  ...props
}) => {
  return (
    <PaperButton mode={mode} style={[styles.button, style]} {...props}>
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
});

export default Button;
