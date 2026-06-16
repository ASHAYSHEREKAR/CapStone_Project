import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import CryptoJS from 'crypto-js';

// ----------------------------------------------------
// VIVA EXPLANATION: What does ForgotPasswordComponent do?
// - Purpose: Allows a user to reset their password without contacting an administrator.
// - Question Recovery: Retrieves the user's security question.
// - Validation: Checks if the user's security question answer matches the database record.
// - Hashing: Encrypts the new password using SHA-256 before updating.
// ----------------------------------------------------
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
  
  step = 1; // VIVA EXPLANATION: Step 1 is retrieving the question, Step 2 is verifying the answer and entering a new password.
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // VIVA EXPLANATION: Step 1 Submit. Hits http://localhost:8081/api/auth/security-question?email=...
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
        
        // VIVA EXPLANATION: Spring Boot might return string text or a JSON object depending on configuration.
        // We handle both parsing styles robustly so that no crash occurs.
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
          this.errorMessage = 'Could not retrieve security question. Verify email.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        // VIVA EXPLANATION: If Angular HttpClient throws parsing error because response is raw string,
        // we extract the error message from the response text if HTTP status is 200 (Success).
        if (err.status === 200 && err.error && err.error.text) {
          const resText = err.error.text;
          if (resText.includes('not found') || resText.includes('User not found')) {
            this.errorMessage = 'User not found with this email.';
          } else {
            this.securityQuestion = resText;
            this.step = 2;
          }
        } else {
          this.errorMessage = 'Error retrieving question. User may not exist.';
          console.error('Retrieve question error:', err);
        }
      }
    });
  }

  // VIVA EXPLANATION: Step 2 Submit. Hits http://localhost:8081/api/auth/forgot-password.
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

    // VIVA EXPLANATION: Encrypt password with SHA-256 client-side before sending.
    const encryptedPassword = CryptoJS.SHA256(this.newPassword).toString();

    this.authService.forgotPassword({
      email: this.email,
      securityAnswer: this.securityAnswer,
      newPassword: encryptedPassword
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        const msg = res && res.message ? res.message : (typeof res === 'string' ? res : '');
        
        if (msg.includes('successful') || msg.includes('updated')) {
          this.successMessage = 'Password updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = msg || 'Failed to update password. Verify answer.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        // VIVA EXPLANATION: Handled Angular string parser error when HTTP status is 200 (Success).
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

  // VIVA EXPLANATION: Returns back to Step 1 email form and resets input states.
  onBackToStep1(): void {
    this.step = 1;
    this.securityQuestion = null;
    this.securityAnswer = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
