import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EngineerService } from '../../services/engineer.service';
import CryptoJS from 'crypto-js';

// VIVA EXPLANATION: Coordinates dictionary for mapping Bangalore areas to latitudes and longitudes
const BANGALORE_COORDINATES: { [key: string]: { lat: number; lng: number } } = {
  'Koramangala': { lat: 12.9352, lng: 77.6245 },
  'Whitefield': { lat: 12.9698, lng: 77.7500 },
  'Jayanagar': { lat: 12.9250, lng: 77.5938 },
  'Electronic City': { lat: 12.8440, lng: 77.6760 },
  'HSR Layout': { lat: 12.9121, lng: 77.6446 },
  'Indiranagar': { lat: 12.9784, lng: 77.6408 },
  'JP Nagar': { lat: 12.8912, lng: 77.5853 },
  'Marathahalli': { lat: 12.9591, lng: 77.7009 },
  'MG Road': { lat: 12.9756, lng: 77.6010 },
  'Hebbal': { lat: 13.0358, lng: 77.5970 },
  'Yelahanka': { lat: 13.1007, lng: 77.5963 }
};

// ----------------------------------------------------
// VIVA EXPLANATION: What does RegisterComponent do?
// - Purpose: Handles registering new users (USER, ADMIN, or ENGINEER).
// - Multi-Database Flow: If role is ENGINEER, we register them in both the Auth Microservice database (for login) AND the Engineer Microservice database (for scheduling/workload mapping).
// ----------------------------------------------------
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    phone: '',
    address: '',
    securityQuestion: 'What is your pet name?',
    securityAnswer: '',
    specialization: 'General',
    homeLocation: 'Koramangala'
  };

  bangaloreAreas = Object.keys(BANGALORE_COORDINATES);
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private engineerService: EngineerService,
    private router: Router
  ) {}

  // VIVA EXPLANATION: Executed when user clicks "Register Account".
  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;

    // VIVA EXPLANATION: Hashing the password on client-side using SHA-256 before transmission.
    const encryptedPassword = CryptoJS.SHA256(this.user.password).toString();

    // 1. Prepare data for Auth service registration (port 8081)
    const registerData = {
      name: this.user.name,
      email: this.user.email,
      password: encryptedPassword,
      role: this.user.role,
      phone: this.user.phone,
      address: this.user.address,
      securityQuestion: this.user.securityQuestion,
      securityAnswer: this.user.securityAnswer
    };

    // VIVA EXPLANATION: Save credentials in the user auth service database first.
    this.authService.register(registerData).subscribe({
      next: (res) => {
        if (res && res.includes('Email already registered')) {
          this.errorMessage = res;
          this.isLoading = false;
          return;
        }

        // VIVA EXPLANATION: 2. If registration role is ENGINEER, we also create a profile in the Engineer service (port 8083).
        if (this.user.role === 'ENGINEER') {
          const coords = BANGALORE_COORDINATES[this.user.homeLocation] || { lat: 12.9716, lng: 77.5946 };
          const engineerData = {
            name: this.user.name,
            email: this.user.email,
            password: encryptedPassword,
            specialization: this.user.specialization,
            homeLocation: this.user.homeLocation,
            homeLatitude: coords.lat,
            homeLongitude: coords.lng,
            workload: 0,
            isAvailable: true
          };

          // VIVA EXPLANATION: Calls Engineer Service to create the technician record for mapping and workload calculations.
          this.engineerService.createEngineer(engineerData).subscribe({
            next: () => {
              this.handleRegistrationSuccess();
            },
            error: (err) => {
              this.isLoading = false;
              this.errorMessage = 'Auth succeeded, but failed to create engineer profile. Contact admin.';
              console.error('Engineer profile creation error:', err);
            }
          });
        } else {
          this.handleRegistrationSuccess();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Registration failed. Please try again.';
        console.error('Registration error:', err);
      }
    });
  }

  // VIVA EXPLANATION: Success handler that shows a success alert and redirects the user to the login screen after a short delay.
  private handleRegistrationSuccess(): void {
    this.isLoading = false;
    this.successMessage = 'Registration successful! Redirecting to login...';
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
