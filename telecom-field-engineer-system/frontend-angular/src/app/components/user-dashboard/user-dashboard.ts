import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { Ticket } from '../../models/ticket.model';

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
  
  filterStatus = 'ALL'; // 'ALL', 'CURRENT', 'PREVIOUS'
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.loadTickets(currentUser.userId);
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadTickets(userId: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.ticketService.getTicketsByUserId(userId).subscribe({
      next: (data) => {
        this.isLoading = false;
        // Sort by created date descending
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

  setFilter(filter: string): void {
    this.filterStatus = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.filterStatus === 'ALL') {
      this.filteredTickets = this.tickets;
    } else if (this.filterStatus === 'CURRENT') {
      // Current tickets are those not resolved yet (SUCCESS or FAILURE are resolved)
      this.filteredTickets = this.tickets.filter(t => t.status !== 'SUCCESS' && t.status !== 'FAILURE');
    } else if (this.filterStatus === 'PREVIOUS') {
      // Previous/resolved tickets
      this.filteredTickets = this.tickets.filter(t => t.status === 'SUCCESS' || t.status === 'FAILURE');
    }
  }

  viewDetails(ticket: Ticket): void {
    this.selectedTicket = ticket;
  }

  closeModal(): void {
    this.selectedTicket = null;
  }

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
