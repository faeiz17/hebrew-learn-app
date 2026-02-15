import httpClient from "./HttpClient";

import { User, AuthResponse } from "@/types";

class AuthApi {
  static async login(email: string, password = "Password123!"): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>("/users/login", { email, password });
    return response.data;
  }

  static async register(name: string, email: string, password = "Password123!"): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>("/users/register", { name, email, password });
    return response.data;
  }

  static async getMe(): Promise<User> {
    const response = await httpClient.get<User>("/users/me");
    return response.data;
  }

  static async logout(): Promise<void> {
    // Session state handles token removal
    return Promise.resolve();
  }

  static async updateUser(
    userId: string,
    updates: Partial<User>,
  ): Promise<User> {
    const response = await httpClient.put(`/users/${userId}`, updates);
    return response.data.user;
  }
}

export default AuthApi;
