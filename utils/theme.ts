import { Theme, Colors } from "./theme-engine";

// Mocking @rn-vui/themed types locally since we don't have the package
export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P];
};

// Global Style Mocks (since we don't have @/styles yet, we'll define basics here or import if created)
// For now, defining basic values to allow compilation
const Spacing: Record<number, number> = {
  2: 2,
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
};
const Size: Record<number, number> = { 16: 16, 24: 24, 32: 32, 40: 40, 48: 48 };
const BorderRadius: Record<number, number> = { 100: 8, 200: 16, 300: 24 };
const FontSize: Record<number, number> = { 14: 14 };
const GlobalStyle: any = {
  paragraphM: { fontSize: 16 },
  headingL: { fontSize: 32, fontWeight: "bold" },
  headingM: { fontSize: 24, fontWeight: "bold" },
  headingS: { fontSize: 20, fontWeight: "bold" },
  headingXS: { fontSize: 18, fontWeight: "bold" },
  labelL: { fontSize: 18, fontWeight: "500" },
  labelM: { fontSize: 16, fontWeight: "500" },
  labelS: { fontSize: 14, fontWeight: "500" },
  fontWeight400: { fontWeight: "400" },
  fontWeight500: { fontWeight: "500" },
};

export const commonColors = {
  primary: "#000000",
  red0: "#FFEBEE",
  red1: "#FFCDD2",
  red6: "#E53935",
  red7: "#D32F2F",
  blue6: "#1E88E5",
  blue7: "#1976D2",
  green0: "#E8F5E9",
  green6: "#43A047",
  green7: "#388E3C",
  amber6: "#FFB300",
  yellow0: "#FFFDE7",
  grey1: "#F5F5F5",
  grey2: "#EEEEEE",
  grey3: "#E0E0E0",
  grey5: "#9E9E9E",
  grey9: "#212121",
  blueGrey4: "#78909C",
  blueGrey5: "#607D8B",
  custom0: "#FFFFFF",
  custom1: "#F9FBFF",
  custom2: "#F3F8FF",
  custom3: "#E8F1FF",
  custom6: "#30A6A6",
  custom7: "#2E403C",
  lime9: "#827717",
  lightBlue0: "#E1F5FE",
};

export const featureColors = {
  truBrokerColor1: "#2399D8",
  truBrokerColor2: "#82278A",
  truBrokerColor3: "#E8F5FB",
  truBrokerColor4: "#F4E9F5",
  truCheckIconColor: "#28B26D",
  creditsWalletColor: "#F3C354",
};

export const portal1 = {
  lightColors: {
    ...commonColors,
    themeGradientColor1: "#ABFFB2",
    themeGradientColor2: "#E1FFE4",
    backgroundPrimary: commonColors.custom2,
    backgroundSecondary: commonColors.custom0,
    backgroundTertiary: commonColors.custom1,
    backgroundPrimaryInverse: commonColors.grey9,
    contentPrimary: commonColors.grey9,
    contentSecondary: commonColors.blueGrey5,
    contentPrimaryInverse: commonColors.custom0,
    contentPlaceholder: commonColors.blueGrey4,
    borderPrimary: commonColors.custom3,
    borderSelected: commonColors.grey9,
    backgroundStateDisable: commonColors.grey1,
    backgroundOverlay: commonColors.grey9,
    backgroundAccent: commonColors.blue6,
    backgroundNegative: commonColors.red6,
    backgroundWarning: commonColors.amber6,
    backgroundPositive: commonColors.green6,
    backgroundLightAccent: commonColors.lightBlue0,
    backgroundLightNegative: commonColors.red0,
    backgroundLightWarning: commonColors.yellow0,
    backgroundLightPositive: commonColors.green0,
    contentStateDisable: commonColors.grey5,
    contentOnColor: commonColors.custom0,
    contentAccent: commonColors.blue7,
    contentNegative: commonColors.red7,
    contentWarning: commonColors.lime9,
    contentPositive: commonColors.green7,
    borderStateDisable: commonColors.grey3,
    borderAccent: commonColors.blue6,
    borderNegative: commonColors.red6,
    borderWarning: commonColors.amber6,
    borderPositive: commonColors.green6,
    success: commonColors.green6,
    error: commonColors.red6,
    warning: commonColors.amber6,
    loginGradientColor1: commonColors.custom6,
    loginGradientColor2: commonColors.custom7,
    ...featureColors,
  },
  darkColors: {
    ...commonColors,
    // For now mirroring light colors or defining dark specific if needed
    // In a real migration we'd verify dark mode values from Leopard
    themeGradientColor1: "#ABFFB2",
    themeGradientColor2: "#E1FFE4",
    backgroundPrimary: commonColors.custom2,
    backgroundSecondary: commonColors.custom0,
    backgroundTertiary: commonColors.custom1,
    backgroundPrimaryInverse: commonColors.grey9,
    contentPrimary: commonColors.grey9,
    contentSecondary: commonColors.blueGrey5,
    contentPrimaryInverse: commonColors.custom0,
    contentPlaceholder: commonColors.blueGrey4,
    borderPrimary: commonColors.custom3,
    borderSelected: commonColors.grey9,
    backgroundStateDisable: commonColors.grey1,
    backgroundOverlay: commonColors.grey9,
    backgroundAccent: commonColors.blue6,
    backgroundNegative: commonColors.red6,
    backgroundWarning: commonColors.amber6,
    backgroundPositive: commonColors.green6,
    backgroundLightAccent: commonColors.lightBlue0,
    backgroundLightNegative: commonColors.red0,
    backgroundLightWarning: commonColors.yellow0,
    backgroundLightPositive: commonColors.green0,
    contentStateDisable: commonColors.grey5,
    contentOnColor: commonColors.custom0,
    contentAccent: commonColors.blue7,
    contentNegative: commonColors.red7,
    contentWarning: commonColors.lime9,
    contentPositive: commonColors.green7,
    borderStateDisable: commonColors.grey3,
    borderAccent: commonColors.blue6,
    borderNegative: commonColors.red6,
    borderWarning: commonColors.amber6,
    borderPositive: commonColors.green6,
    success: commonColors.green6,
    error: commonColors.red6,
    warning: commonColors.amber6,
    loginGradientColor1: commonColors.custom6,
    loginGradientColor2: commonColors.custom7,
    ...featureColors,
  },
};
