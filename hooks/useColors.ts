import { useTheme, Colors } from "../utils/theme-engine";

const useColors = (): Colors => {
  const { theme } = useTheme();

  return theme.colors;
};

export default useColors;
