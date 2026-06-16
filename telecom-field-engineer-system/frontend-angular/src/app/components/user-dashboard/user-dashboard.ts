import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { Ticket } from '../../models/ticket.model';

// ----------------------------------------------------
// VIVA EXPLANATION: What does UserDashboardComponent do?
// - Purpose: Allows a Customer/User to view their submitted tickets and filter by status.
// - Loading: Pulls tickets dynamically by calling the Ticket Service with the active user's ID.
// ----------------------------------------------------
@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboardComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  selectedTicket: Ticket | null = null;
  
  filterStatus = 'ALL'; // Can be 'ALL', 'CURRENT' (Open/Assigned/etc.), or 'PREVIOUS' (Success/Failure)
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router
  ) {}

  // VIVA EXPLANATION: On dashboard boot, we retrieve the active user's session from localStorage and load their tickets.
  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.loadTickets(currentUser.userId);
    } else {
      this.router.navigate(['/login']);
    }
  }

  // VIVA EXPLANATION: Hits GET http://localhost:8082/api/tickets/user/{userId} to load history.
  loadTickets(userId: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.ticketService.getTicketsByUserId(userId).subscribe({
      next: (data) => {
        this.isLoading = false;
        // Sort tickets by creation date (newest first)
        this.tickets = data.sort((a, b) => {
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        });
        this.applyFilter();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load tickets. Please try again.';
        console.error('User tickets load error:', err);
      }
    });
  }

  // VIVA EXPLANATION: Fired when clicking the filter buttons (All, Active, Resolved).
  setFilter(filter: string): void {
    this.filterStatus = filter;
    this.applyFilter();
  }

  // VIVA EXPLANATION: Separates tickets into active (OPEN/ASSIGNED/ACCEPTED/IN_PROGRESS) or previous (SUCCESS/FAILURE).
  applyFilter(): void {
    if (this.filterStatus === 'ALL') {
      this.filteredTickets = this.tickets;
    } else if (this.filterStatus === 'CURRENT') {
      // Active tickets are those that are NOT resolved yet
      this.filteredTickets = this.tickets.filter(t => t.status !== 'SUCCESS' && t.status !== 'FAILURE');
    } else if (this.filterStatus === 'PREVIOUS') {
      // Resolved/completed tickets
      this.filteredTickets = this.tickets.filter(t => t.status === 'SUCCESS' || t.status === 'FAILURE');
    }
  }

  // VIVA EXPLANATION: Shows details modal for a clicked ticket.
  viewDetails(ticket: Ticket): void {
    this.selectedTicket = ticket;
  }

  // VIVA EXPLANATION: Closes the details modal.
  closeModal(): void {
    this.selectedTicket = null;
  }

  // Simple CSS class binders
  getPriorityClass(priority: string): string {
    return `badge-${priority.toLowerCase()}`;
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'SUCCESS': return 'badge-success';
      case 'FAILURE': return 'badge-danger';
      case 'OPEN': return 'badge-info';
      case 'DEFERRED': return 'badge-warning';
      default: return 'badge-medium';
    }
  }
}
