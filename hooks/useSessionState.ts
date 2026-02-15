import { useState, useEffect } from "react";

import { User, AuthResponse } from "@/types";
import {
  getLocalItemAsync,
  setLocalItemAsync,
  removeLocalItemAsync,
  LocalStorageKey,
} from "@/utils/helpers/Storage";

export const useSessionState = () => {
  const [session, setSessionState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const storedUser = await getLocalItemAsync(LocalStorageKey.USER);
      if (storedUser) {
        setSessionState(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    loadSession();
  }, []);

  const setSession = async (user: User | null, token?: string) => {
    setSessionState(user);
    if (user) {
      await setLocalItemAsync(LocalStorageKey.USER, JSON.stringify(user));
      if (token) {
        await setLocalItemAsync(LocalStorageKey.SESSION, token);
      }
    } else {
      await removeLocalItemAsync(LocalStorageKey.USER);
      await removeLocalItemAsync(LocalStorageKey.SESSION);
    }
  };

  return [[isLoading, session], setSession] as const;
};
