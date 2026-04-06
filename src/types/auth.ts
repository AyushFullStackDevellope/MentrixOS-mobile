export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  lastLogin?: string;
}

export type UserRole = 
  | 'SuperAdmin' 
  | 'InstituteAdmin' 
  | 'Teacher' 
  | 'Student' 
  | 'Parent' 
  | 'Staff';

export interface LoginRequest {
  email: string;
  password?: string;
  otp?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  institutes: any[]; // Define mapping if needed
}

export interface UserProfileResponse {
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
