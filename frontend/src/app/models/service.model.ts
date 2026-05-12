export interface Service {
  id?: number;
  title: string;
  description?: string|null;
  icon: string;           
  link_url: string;
  is_new_tab: boolean;
  status: 'online'|'maintenance';
  color_from: string;
  color_to: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string|null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}
