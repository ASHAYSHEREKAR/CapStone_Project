import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

// ----------------------------------------------------
// VIVA EXPLANATION: What does NavbarComponent do?
// - Purpose: Holds the top header links.
// - Role-based menu links: Hides or shows links (like Raise Ticket, Assign Dashboard, Hazard control)
//   dynamically based on the role of the logged-in user retrieved from localStorage.
// ----------------------------------------------------
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // VIVA EXPLANATION: Getter checked by template to hide navbar on login/register screens.
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // VIVA EXPLANATION: Getter to display current user's name in navbar.
  get currentUser() {
    return this.authService.getCurrentUser();
  }

  // VIVA EXPLANATION: Getter to toggle role-specific routing links.
  get userRole(): string | null {
    return this.authService.getRole();
  }

  // VIVA EXPLANATION: Fired when clicking "Logout". Clears localStorage and redirects to login route.
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
