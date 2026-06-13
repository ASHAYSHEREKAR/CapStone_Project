import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import CryptoJS from 'crypto-js';

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
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.redirectUser(this.authService.getRole());
    }
  }

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Encrypt password using SHA-256 for secure transmission (NFR1)
    const encryptedPassword = CryptoJS.SHA256(this.credentials.password).toString();

    this.authService.login({
      email: this.credentials.email,
      password: encryptedPassword
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.userId && res.message.includes('successful')) {
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
