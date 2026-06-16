import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';

// VIVA EXPLANATION: Coordinate mapping dictionary matching specific areas in Bangalore.
// Used to assign latitude/longitude coordinates to a raised ticket, which the backend matching service parses.
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
// VIVA EXPLANATION: What does RaiseTicketComponent do?
// - Purpose: Allows a customer to submit a new service ticket (FAULT or INSTALLATION).
// - Location mapping: When the user selects a Bangalore area, the coordinates (lat/lng) are automatically looked up from our map dictionary and stored in the ticket.
// ----------------------------------------------------
@Component({
  selector: 'app-raise-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './raise-ticket.html',
  styleUrls: ['./raise-ticket.css']
})
export class RaiseTicketComponent {
  ticket = {
    ticketType: 'FAULT',
    location: 'Koramangala',
    description: ''
  };

  bangaloreAreas = Object.keys(BANGALORE_COORDINATES);
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router
  ) {}

  // VIVA EXPLANATION: Executed on ticket submission. Hits POST http://localhost:8082/api/tickets.
  onSubmit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.ticket.description.trim()) {
      this.errorMessage = 'Please describe your request.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    // VIVA EXPLANATION: Maps the selected area name to coordinates.
    const coords = BANGALORE_COORDINATES[this.ticket.location] || { lat: 12.9716, lng: 77.5946 };

    // VIVA EXPLANATION: Build the payload schema matching what the Ticket Microservice expects.
    const ticketData = {
      userId: currentUser.userId,
      userName: currentUser.name,
      ticketType: this.ticket.ticketType,
      description: this.ticket.description,
      location: this.ticket.location,
      latitude: coords.lat,
      longitude: coords.lng
    };

    // VIVA EXPLANATION: Sends the ticket creation request.
    this.ticketService.createTicket(ticketData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = 'Ticket raised successfully! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to submit ticket. Please try again.';
        console.error('Create ticket error:', err);
      }
    });
  }
}
