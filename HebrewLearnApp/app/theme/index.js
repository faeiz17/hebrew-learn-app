// app/theme/index.js
import { MD3LightTheme as DefaultTheme } from "react-native-paper";

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0284c7",
    accent: "#3b82f6",
    background: "#3b82f6",
    // add or override colors as needed
  },
  // You can also override fonts, etc.
  // fonts: {...}
};
