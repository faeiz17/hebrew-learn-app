export interface User {
  _id: string;
  name: string;
  email: string;
  level: number;
  points: number;
  starsEarned: number;
  streak: number;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}
