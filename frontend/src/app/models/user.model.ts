export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  national_id: string;
  workgroup?: string;
  role: 'admin' | 'user';
  google2fa_enabled: number;
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