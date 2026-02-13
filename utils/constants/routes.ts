export const AppRoutes = {
  DRAWER: {
    ROOT: "/(drawer)",
    HOME: "/(drawer)/index",
    LESSONS: "/(drawer)/lessons",
    LEADERBOARD: "/(drawer)/leaderboard",
    SETTINGS: "/(drawer)/settings",
  },
  EXERCISES: {
    ROOT: "/exercises",
    DETAILS: (id: string) => `/exercises/${id}`,
  },
} as const;
