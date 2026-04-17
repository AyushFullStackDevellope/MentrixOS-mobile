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

import type { Institute, User as SessionUser } from './session';

export interface LoginResponse {
  token: string;
  user: SessionUser;
  institutes: Institute[];
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
