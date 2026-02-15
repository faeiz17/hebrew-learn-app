export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  avatarUrl: string;
  bio: string;
  xp: number;
  highestUnlockedLevel: number;
  dailyStreak: number;
  preferences: {
    isDarkMode: boolean;
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
}

export interface AuthResponse {
  user: User;
  token?: string;
}
