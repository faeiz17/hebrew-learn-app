import httpClient from "./HttpClient";

import { User, AuthResponse } from "@/types";

class AuthApi {
  // Mock login for now
  static async login(email: string): Promise<AuthResponse> {
    // SIMULATION: In a real app, this would be a POST request
    // const response = await httpClient.post('/auth/login', { email, password });
    // return response.data;

    // MOCK DATA
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            _id: "user_123",
            name: "Young Explorer",
            email,
            level: 1,
            points: 0,
            starsEarned: 0,
            streak: 0,
            avatar: "https://randomuser.me/api/portraits/kids/3.jpg",
          },
          token: "mock_token_123",
        });
      }, 1000);
    });
  }

  static async logout(): Promise<void> {
    // Simulate logout
    return Promise.resolve();
  }

  static async updateUser(
    userId: string,
    updates: Partial<User>,
  ): Promise<User> {
    // SIMULATION
    // const response = await httpClient.put(\`/users/\${userId}\`, updates);
    // return response.data.user;

    // MOCK
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          _id: userId,
          name: "Young Explorer",
          email: "test@example.com",
          level: updates.level || 1,
          points: updates.points || 0,
          starsEarned: updates.starsEarned || 0,
          streak: 0,
          ...updates,
        } as User);
      }, 500);
    });
  }
}

export default AuthApi;
