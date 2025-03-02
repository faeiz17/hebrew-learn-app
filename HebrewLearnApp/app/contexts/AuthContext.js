// app/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import SplashScreen from "../screens/Home/SplashScreen"; // Import SplashScreen

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Track the logged-in user
  const [user, setUser] = useState(null);

  // Track which level is unlocked; defaults to 1 (only the first level unlocked)
  const [unlockedLevel, setUnlockedLevel] = useState(1);

  // Splash Screen state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (e.g., checking stored data)
    setTimeout(() => {
      setLoading(false); // Hide splash screen after 2 seconds
    }, 2000);
  }, []);

  // Log the user in (could store tokens, etc.)
  const login = (userData) => {
    setUser(userData);
    // Optionally setUnlockedLevel based on userData if provided
    // setUnlockedLevel(userData?.unlockedLevel || 1);
  };

  // Log the user out
  const logout = () => {
    setUser(null);
    // Optionally reset unlockedLevel to 1 upon logout
    setUnlockedLevel(1);
  };

  // Unlock the next level
  const unlockNextLevel = () => {
    setUnlockedLevel((prev) => prev + 1);
  };

  // **Call Splash Screen While Loading**
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
