import React from "react";
import { StyleSheet, StyleProp, ViewStyle } from "react-native";
import { TextInput as PaperInput, TextInputProps } from "react-native-paper";

interface InputProps extends TextInputProps {
    style?: StyleProp<ViewStyle>;
}

const Input: React.FC<InputProps> = ({ mode = "outlined", style, ...props }) => {
    return <PaperInput mode={mode} style={[styles.input, style]} {...props} />;
};

const styles = StyleSheet.create({
    input: {
        width: "100%",
        backgroundColor: "transparent",
    },
});

export default Input;
