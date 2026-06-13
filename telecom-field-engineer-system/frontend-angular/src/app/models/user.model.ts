/**
 * User model matching the backend User entity
 */
export interface User {
  userId?: number;
  name: string;
  email: string;
  password?: string;
  role: 'USER' | 'ADMIN' | 'ENGINEER';
  phone?: string;
  address?: string;
  securityQuestion?: string;
  securityAnswer?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  name: string;
  email: string;
  role: string;
  message: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  address: string;
  securityQuestion: string;
  securityAnswer: string;
}

export interface ForgotPasswordRequest {
  email: string;
  securityAnswer: string;
  newPassword: string;
}
