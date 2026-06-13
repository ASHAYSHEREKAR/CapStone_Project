import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, LoginRequest, LoginResponse, RegisterRequest, ForgotPasswordRequest } from '../models/user.model';

/**
 * Authentication Service
 * Communicates with the Auth Service backend (port 8081)
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) {}

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, request);
  }

  getSecurityQuestion(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/security-question?email=${email}`);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, request);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users/role/${role}`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user/${id}`);
  }

  updateProfile(id: number, request: any): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/user/${id}`, request);
  }

  /** Store user session in localStorage */
  saveSession(user: LoginResponse): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /** Get current logged-in user */
  getCurrentUser(): LoginResponse | null {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }

  /** Check if user is logged in */
  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }

  /** Get current user's role */
  getRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  /** Logout - clear session */
  logout(): void {
    localStorage.removeItem('currentUser');
  }
}
