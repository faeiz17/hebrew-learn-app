export const AppRoutes = {
  DRAWER: {
    ROOT: "(drawer)",
    HOME: "index",
    LESSONS: "lessons",
    LEADERBOARD: "leaderboard",
    SETTINGS: "settings",
  },
  EXERCISES: {
    ROOT: "/exercises",
    DETAILS: (id: string) => `/exercises/${id}`,
  },
  AUTH: {
    LOGIN: "/(auth)/login",
    REGISTER: "/(auth)/register",
  },
} as const;
