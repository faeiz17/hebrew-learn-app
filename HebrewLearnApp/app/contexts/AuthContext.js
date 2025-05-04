import React, { createContext, useState, useEffect } from "react";
import SplashScreen from "../screens/Home/SplashScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [loading, setLoading] = useState(true); // controls Splash

  /* ────────────────────────────────────────────────────────── *
   * 1.  On app start, pull any stored user from AsyncStorage  *
   * ────────────────────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
      } catch (err) {
        console.log("AuthContext: error reading storage ->", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ─────────────────────────── *
   * 2.  Auth helper functions   *
   * ─────────────────────────── */

  // called from LoginScreen on success
  const login = async (userData) => {
    setUser(userData);
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      console.log("AuthContext: error saving user ->", err);
    }

    /* brief brand splash after login */
    setLoading(true);
    setTimeout(() => setLoading(false), 1000); // 1 s
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
    } catch (err) {
      console.log("AuthContext: error removing user ->", err);
    }
    setUser(null);
    setUnlockedLevel(1);
  };

  const unlockNextLevel = () => setUnlockedLevel((p) => p + 1);

  /* Optional helper for PUT /users/:id */
  const updateUserInContext = async (updates) => {
    try {
      const res = await fetch(
        `https://hebrew-backend-8sozbbz4w-faeiz17s-projects.vercel.app/api/users/${user._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }
      );
      if (!res.ok) throw new Error("Failed to update user");
      const data = await res.json();
      setUser(data.user);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      console.log("AuthContext: update error ->", err);
    }
  };

  /* ─────────────────────────── *
   * 3.  Render                  *
   * ─────────────────────────── */
  if (loading) return <SplashScreen />;

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
