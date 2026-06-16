import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import CryptoJS from 'crypto-js';

// ----------------------------------------------------
// VIVA EXPLANATION: What does LoginComponent do?
// - Purpose: Allows users, admins, and engineers to login.
// - Hashing: Uses SHA-256 (client-side) before sending to the backend API.
// - Redirection: Based on the role returned (ADMIN -> /admin, ENGINEER -> /engineer, USER -> /dashboard).
// ----------------------------------------------------
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // VIVA EXPLANATION: If user session already exists in localStorage, redirect them immediately to their dashboard.
    if (this.authService.isLoggedIn()) {
      this.redirectUser(this.authService.getRole());
    }
  }

  // VIVA EXPLANATION: Fired when user clicks "Sign In".
  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // VIVA EXPLANATION: Encrypts the password using SHA-256 (as specified in non-functional security requirements).
    const encryptedPassword = CryptoJS.SHA256(this.credentials.password).toString();

    // VIVA EXPLANATION: Call authService.login, which hits the microservice on http://localhost:8081/api/auth/login.
    this.authService.login({
      email: this.credentials.email,
      password: encryptedPassword
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.userId && res.message.includes('successful')) {
          // VIVA EXPLANATION: Saves the user info in the browser's localStorage for session maintenance.
          this.authService.saveSession(res);
          this.redirectUser(res.role);
        } else {
          this.errorMessage = res.message || 'Login failed. Please check credentials.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Backend connection error. Please try again later.';
        console.error('Login error:', err);
      }
    });
  }

  // VIVA EXPLANATION: Redirects the browser view to the respective dashboard route depending on user role.
  private redirectUser(role: string | null): void {
    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else if (role === 'ENGINEER') {
      this.router.navigate(['/engineer']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
