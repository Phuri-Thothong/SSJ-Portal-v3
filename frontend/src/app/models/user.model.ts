export interface User {
  id: number;
  name: string;
  username: string;
  workgroup?: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}