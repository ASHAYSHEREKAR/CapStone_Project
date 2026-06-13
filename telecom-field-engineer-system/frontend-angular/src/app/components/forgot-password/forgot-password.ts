import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent {
  email = '';
  securityQuestion: string | null = null;
  securityAnswer = '';
  newPassword = '';
  confirmPassword = '';
  
  step = 1; // 1: Email collection, 2: Question & Password reset
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRetrieveQuestion(): void {
    if (!this.email) {
      this.errorMessage = 'Please enter your email.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.getSecurityQuestion(this.email).subscribe({
      next: (res) => {
        this.isLoading = false;
        // The backend returns a plain string (question) or "User not found!"
        const resText = typeof res === 'string' ? res : (res && res.text ? res.text : '');
        
        // Wait, angular HttpClient might try to parse as JSON. Let's see if the backend returns string as text.
        // In auth.service.ts, getSecurityQuestion doesn't specify responseType: 'text'. If it's returning text, it might fail to parse as JSON.
        // Let's make sure we handle that, or we should check how getSecurityQuestion is written.
        // Let's write the handler robustly.
        if (res && res.message) {
          if (res.message.includes('not found') || res.message.includes('User not found')) {
            this.errorMessage = 'User not found with this email.';
            return;
          }
          this.securityQuestion = res.message;
          this.step = 2;
        } else if (typeof res === 'string') {
          if (res.includes('not found') || res.includes('User not found')) {
            this.errorMessage = 'User not found with this email.';
            return;
          }
          this.securityQuestion = res;
          this.step = 2;
        } else if (res && res.question) {
          this.securityQuestion = res.question;
          this.step = 2;
        } else {
          this.errorMessage = 'Could not retrieve security question. Make sure email is correct.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        // Let's check if the error is actually parsing error (HttpErrorResponse) but has status 200 and text content
        if (err.status === 200 && err.error && err.error.text) {
          const resText = err.error.text;
          if (resText.includes('not found') || resText.includes('User not found')) {
            this.errorMessage = 'User not found with this email.';
          } else {
            this.securityQuestion = resText;
            this.step = 2;
          }
        } else {
          this.errorMessage = 'Error communicating with Auth service. User might not exist.';
          console.error('Retrieve question error:', err);
        }
      }
    });
  }

  onSubmitReset(): void {
    if (!this.securityAnswer || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Encrypt password using SHA-256 (NFR1)
    const encryptedPassword = CryptoJS.SHA256(this.newPassword).toString();

    this.authService.forgotPassword({
      email: this.email,
      securityAnswer: this.securityAnswer,
      newPassword: encryptedPassword
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        // In the backend, forgotPassword returns a String. It may fail parsing if responseType isn't set, so let's handle both.
        const msg = res && res.message ? res.message : (typeof res === 'string' ? res : '');
        
        if (msg.includes('successful') || msg.includes('updated')) {
          this.successMessage = 'Password updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = msg || 'Failed to update password. Verify security answer.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        // If status 200 and parse error
        if (err.status === 200 && err.error && err.error.text) {
          const resText = err.error.text;
          if (resText.includes('successful') || resText.includes('updated')) {
            this.successMessage = 'Password updated successfully!';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
            return;
          } else {
            this.errorMessage = resText;
          }
        } else {
          this.errorMessage = 'Incorrect security answer or network error.';
          console.error('Reset password error:', err);
        }
      }
    });
  }

  onBackToStep1(): void {
    this.step = 1;
    this.securityQuestion = null;
    this.securityAnswer = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
