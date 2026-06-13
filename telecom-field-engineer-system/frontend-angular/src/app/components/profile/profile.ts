import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profileForm = {
    name: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  };

  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.isLoading = true;
      this.authService.getUserById(currentUser.userId).subscribe({
        next: (userData) => {
          this.isLoading = false;
          this.user = userData;
          this.profileForm.name = userData.name;
          this.profileForm.phone = userData.phone || '';
          this.profileForm.address = userData.address || '';
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to load profile details.';
          console.error('Profile load error:', err);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    if (!this.user || !this.user.userId) return;

    this.errorMessage = null;
    this.successMessage = null;

    if (this.profileForm.password) {
      if (this.profileForm.password.length < 6) {
        this.errorMessage = 'Password must be at least 6 characters.';
        return;
      }
      if (this.profileForm.password !== this.profileForm.confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }
    }

    this.isLoading = true;

    const updateData: any = {
      name: this.profileForm.name,
      phone: this.profileForm.phone,
      address: this.profileForm.address
    };

    if (this.profileForm.password) {
      updateData.password = CryptoJS.SHA256(this.profileForm.password).toString();
    }

    this.authService.updateProfile(this.user.userId, updateData).subscribe({
      next: (updatedUser) => {
        this.isLoading = false;
        this.successMessage = 'Profile updated successfully!';
        this.user = updatedUser;
        
        // Update user session name if changed
        const session = this.authService.getCurrentUser();
        if (session) {
          session.name = updatedUser.name;
          this.authService.saveSession(session);
        }
        
        // Clear passwords
        this.profileForm.password = '';
        this.profileForm.confirmPassword = '';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to update profile. Try again.';
        console.error('Profile update error:', err);
      }
    });
  }
}
