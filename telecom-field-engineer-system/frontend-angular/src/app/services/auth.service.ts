import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, LoginRequest, LoginResponse, RegisterRequest, ForgotPasswordRequest } from '../models/user.model';

// ----------------------------------------------------
// VIVA EXPLANATION: What is AuthService?
// - Purpose: Communicates with the Authentication Microservice.
// - URL: Hits the backend running on http://localhost:8081/api/auth.
// - Responsibility: Manages registration, login, password recovery, and user session storage.
// ----------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) {}

  // VIVA EXPLANATION: Registers a new User or Engineer in the authentication service.
  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, request);
  }

  // VIVA EXPLANATION: Authenticates credentials. Sends email and the encrypted password to the backend.
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, request);
  }

  // VIVA EXPLANATION: Retrieves security question registered by the user using their email.
  getSecurityQuestion(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/security-question?email=${email}`);
  }

  // VIVA EXPLANATION: Submits the security question answer and updates password if correct.
  forgotPassword(request: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, request);
  }

  // VIVA EXPLANATION: Retrieves all registered users (used by Admin views).
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  // VIVA EXPLANATION: Retrieves users filtered by their role (e.g. USER, ADMIN, ENGINEER).
  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users/role/${role}`);
  }

  // VIVA EXPLANATION: Retrieves a single user's detail by ID.
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user/${id}`);
  }

  // VIVA EXPLANATION: Updates profile details (name, phone, address, optional password).
  updateProfile(id: number, request: any): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/user/${id}`, request);
  }

  // VIVA EXPLANATION: Saves the logged-in user's details and role in the browser's localStorage.
  saveSession(user: LoginResponse): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // VIVA EXPLANATION: Gets current logged-in user from localStorage.
  getCurrentUser(): LoginResponse | null {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }

  // VIVA EXPLANATION: Checks if a user is currently logged in.
  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }

  // VIVA EXPLANATION: Retrieves the role of the logged-in user (USER, ADMIN, or ENGINEER) for routing/views.
  getRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  // VIVA EXPLANATION: Logs out the user by clearing their session data from localStorage.
  logout(): void {
    localStorage.removeItem('currentUser');
  }
}
