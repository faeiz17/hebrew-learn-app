// App.js
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import RootNavigator from "./app/navigation";
import { theme } from "./app/theme";
import { AuthProvider } from "./app/contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <RootNavigator />
      </PaperProvider>
    </AuthProvider>
  );
}
