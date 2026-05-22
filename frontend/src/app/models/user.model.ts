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
  token?: string;
  user?: User;
  national_id?: string;
  qr_code_url?: string;
  google2fa_secret?: string;
  google2fa_enabled?: number;
}