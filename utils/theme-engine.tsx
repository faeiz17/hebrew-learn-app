import React, { createContext, useContext, useMemo } from "react";
// Actually Leopard imports Colors from @rn-vui/themed. So we need to define the interfaces here.

export interface Colors {
  primary: string;
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  contentPrimary: string;
  contentSecondary: string;
  contentPlaceholder: string;
  borderPrimary: string;
  borderSelected: string;
  backgroundStateDisable: string;
  contentStateDisable: string;
  backgroundOverlay: string;
  success: string;
  error: string;
  warning: string;
  [key: string]: string | object;
}

export interface ComponentTheme {
  [key: string]: any;
}

export interface Theme {
  colors: Colors;
  spacing: Record<number, number>;
  radius: Record<number, number>;
  fontSize: Record<number, number>;
  styles: Record<string, any>;
  components?: ComponentTheme;
}

interface ThemeContextType {
  theme: Theme;
  updateTheme: (updates: Partial<Theme>) => void;
  replaceTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{
  theme: Theme;
  children: React.ReactNode;
}> = ({ theme, children }) => {
  const value = useMemo(
    () => ({
      theme,
      updateTheme: () => console.warn("updateTheme not implemented in mock"),
      replaceTheme: () => console.warn("replaceTheme not implemented in mock"),
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const withTheme = (Component: any) => {
  return (props: any) => {
    const { theme } = useTheme();
    return <Component {...props} theme={theme} />;
  };
};
