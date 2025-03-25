// app/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import SplashScreen from "../screens/Home/SplashScreen"; // or wherever your splash screen is
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      console.log("AuthContext: starting loadUserFromStorage");
      try {
        const storedUser = await AsyncStorage.getItem("user");
        console.log("storedUser:", storedUser);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log("AuthContext: user set from storage");
        } else {
          console.log("AuthContext: no user found in storage");
        }
      } catch (err) {
        console.log("AuthContext: error loading user from storage ->", err);
      } finally {
        console.log("AuthContext: calling setLoading(false)");
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  if (loading) {
    console.log("AuthContext: loading == true, returning <SplashScreen />");
    return <SplashScreen />;
  }
  console.log("AuthContext: loading == false, returning children");

  // Log the user in (could store tokens, etc. — but we do that in LoginScreen)
  const login = (userData) => {
    setUser(userData);
    // If userData has a known highestUnlockedLevel, set it here:
    // setUnlockedLevel(userData.highestUnlockedLevel || 1);
  };
  const updateUserInContext = async (updates) => {
    try {
      // We assume user._id is stored in context. If not, adjust accordingly.
      const response = await fetch(
        `https://hebrew-backend-8sozbbz4w-faeiz17s-projects.vercel.app/api/users/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      const data = await response.json();
      // data.user is the updated user from the backend
      const updatedUser = data.user;

      // Update context state
      setUser(updatedUser);

      // Update AsyncStorage so changes persist across app restarts
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };
  // Log the user out
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user"); // remove from storage
    } catch (err) {
      console.log("Error removing user from storage:", err);
    }
    setUser(null);
    setUnlockedLevel(1);
  };

  // Unlock the next level
  const unlockNextLevel = () => {
    setUnlockedLevel((prev) => prev + 1);
  };

  // If still loading from storage, show splash screen or a loader
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        unlockedLevel,
        unlockNextLevel,
        updateUserInContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
