import AsyncStorage from "@react-native-async-storage/async-storage";

export const LocalStorageKey = {
  USER: "user",
  SESSION: "session",
};

export const setLocalItemAsync = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error("Error setting local item:", error);
  }
};

export const getLocalItemAsync = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error("Error getting local item:", error);
    return null;
  }
};

export const removeLocalItemAsync = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing local item:", error);
  }
};
