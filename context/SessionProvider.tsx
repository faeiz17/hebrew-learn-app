import { router } from "expo-router";
import React, { createContext, useContext, useState } from "react";

import AuthApi from "@/api/Auth";
import { useSessionState } from "@/hooks/useSessionState";
import { User } from "@/types";

interface SessionContextType {
  signIn: (email: string) => Promise<void>;
  signOut: () => void;
  session: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<SessionContextType | null>(null);

export const useSession = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return value;
};

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [[isLoading, session], setSession] = useSessionState();

  const signIn = async (email: string) => {
    try {
      const response = await AuthApi.login(email);
      await setSession(response.user);
      router.replace("/(drawer)");
    } catch (error) {
      console.error("Sign in failed:", error);
      // Ensure specific error handling or rethrow if needed
      throw error;
    }
  };

  const signOut = async () => {
    await AuthApi.logout();
    setSession(null);
    router.replace("/");
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
