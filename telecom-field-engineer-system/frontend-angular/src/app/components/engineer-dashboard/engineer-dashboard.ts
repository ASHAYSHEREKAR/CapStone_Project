import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { EngineerService } from '../../services/engineer.service';
import { AuthService } from '../../services/auth.service';
import { Ticket } from '../../models/ticket.model';
import { Engineer } from '../../models/engineer.model';

// ----------------------------------------------------
// VIVA EXPLANATION: What does EngineerDashboardComponent do?
// - Purpose: Field Engineer's task hub.
// - Operations: Toggle on/off availability, schedule leaves, accept/reject tickets, update task progress, and log feedback notes.
// ----------------------------------------------------
@Component({
  selector: 'app-engineer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './engineer-dashboard.html',
  styleUrls: ['./engineer-dashboard.css']
})
export class EngineerDashboardComponent implements OnInit {
  engineer: Engineer | null = null;
  tickets: Ticket[] = [];
  
  assignedTickets: Ticket[] = []; // Tickets waiting for accept/reject (status ASSIGNED)
  activeTickets: Ticket[] = [];   // Tickets currently in progress (status ACCEPTED, IN_PROGRESS)
  pastTickets: Ticket[] = [];     // Resolved tickets (status SUCCESS, FAILURE, DEFERRED)

  // Leave Planner state
  holiday = {
    holidayStart: '',
    holidayEnd: ''
  };

  selectedTicket: Ticket | null = null;
  statusUpdate = {
    status: 'SUCCESS',
    notes: ''
  };

  isLoading = false;
  isActionLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private ticketService: TicketService,
    private engineerService: EngineerService,
    private authService: AuthService,
    private router: Router
  ) {}

  // VIVA EXPLANATION: Route guard checking role before triggering profile load.
  ngOnInit(): void {
    if (this.authService.getRole() !== 'ENGINEER') {
      this.router.navigate(['/login']);
      return;
    }
    this.loadEngineerProfile();
  }

  // VIVA EXPLANATION: Pulls engineer profile details from http://localhost:8083/api/engineers/email/{email}.
  loadEngineerProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.isLoading = true;
    this.engineerService.getEngineerByEmail(currentUser.email).subscribe({
      next: (eng) => {
        this.engineer = eng;
        this.holiday.holidayStart = eng.holidayStart || '';
        this.holiday.holidayEnd = eng.holidayEnd || '';
        this.loadTasks(eng.engineerId!);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load technician profile. Please contact admin.';
        console.error('Engineer load error:', err);
      }
    });
  }

  // VIVA EXPLANATION: Retrieves tickets linked to this engineer's ID from port 8082.
  loadTasks(engineerId: number): void {
    this.ticketService.getTicketsByEngineerId(engineerId).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.tickets = data.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        this.categorizeTickets();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to retrieve assigned tickets.';
        console.error('Engineer tickets load error:', err);
      }
    });
  }

  // VIVA EXPLANATION: Groups tickets into categories for dashboard visualization lists.
  categorizeTickets(): void {
    this.assignedTickets = this.tickets.filter(t => t.status === 'ASSIGNED');
    this.activeTickets = this.tickets.filter(t => t.status === 'ACCEPTED' || t.status === 'IN_PROGRESS');
    this.pastTickets = this.tickets.filter(t => t.status === 'SUCCESS' || t.status === 'FAILURE' || t.status === 'DEFERRED');
  }

  // VIVA EXPLANATION: Toggles availability status. If OFF DUTY, the auto-assignment matching excludes them.
  toggleAvailability(): void {
    if (!this.engineer) return;

    const updated = {
      isAvailable: !this.engineer.isAvailable
    };

    this.engineerService.updateEngineer(this.engineer.engineerId!, updated).subscribe({
      next: (res) => {
        this.engineer!.isAvailable = res.isAvailable;
        this.successMessage = `Availability updated to ${res.isAvailable ? 'AVAILABLE' : 'OFF DUTY'}`;
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update availability.';
        console.error('Toggle availability error:', err);
      }
    });
  }

  // VIVA EXPLANATION: Saves leave planner dates. The matching engine ignores engineers on active leave.
  saveHoliday(): void {
    if (!this.engineer) return;

    const data = {
      holidayStart: this.holiday.holidayStart ? this.holiday.holidayStart : null,
      holidayEnd: this.holiday.holidayEnd ? this.holiday.holidayEnd : null
    };

    this.engineerService.setHoliday(this.engineer.engineerId!, data).subscribe({
      next: (res) => {
        this.engineer!.holidayStart = res.holidayStart;
        this.engineer!.holidayEnd = res.holidayEnd;
        this.successMessage = 'Leave planner updated successfully!';
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update leave dates.';
        console.error('Save holiday error:', err);
      }
    });
  }

  clearHoliday(): void {
    this.holiday.holidayStart = '';
    this.holiday.holidayEnd = '';
    this.saveHoliday();
  }

  // VIVA EXPLANATION: Accepts task. Status moves from ASSIGNED -> ACCEPTED.
  acceptTicket(ticketId: number): void {
    this.isActionLoading = true;
    this.ticketService.updateStatus(ticketId, { status: 'ACCEPTED' }).subscribe({
      next: () => {
        this.isActionLoading = false;
        this.successMessage = 'Task accepted successfully!';
        this.loadEngineerProfile();
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.isActionLoading = false;
        this.errorMessage = 'Failed to accept task.';
        console.error('Accept ticket error:', err);
      }
    });
  }

  // VIVA EXPLANATION: Rejects task. Status moves from ASSIGNED -> REJECTED.
  // The ticket is returned to the unassigned pool and the engineer's workload is decremented.
  rejectTicket(ticketId: number): void {
    this.isActionLoading = true;
    this.ticketService.updateStatus(ticketId, { status: 'REJECTED' }).subscribe({
      next: () => {
        this.isActionLoading = false;
        this.successMessage = 'Task rejected. Ticket returned to unassigned pool.';
        this.loadEngineerProfile();
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.isActionLoading = false;
        this.errorMessage = 'Failed to reject task.';
        console.error('Reject ticket error:', err);
      }
    });
  }

  // VIVA EXPLANATION: Starts active work. Status moves to IN_PROGRESS.
  startWork(ticketId: number): void {
    this.isActionLoading = true;
    this.ticketService.updateStatus(ticketId, { status: 'IN_PROGRESS' }).subscribe({
      next: () => {
        this.isActionLoading = false;
        this.loadEngineerProfile();
      },
      error: (err) => {
        this.isActionLoading = false;
        this.errorMessage = 'Failed to update status to IN PROGRESS.';
      }
    });
  }

  openUpdateModal(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.statusUpdate.status = 'SUCCESS';
    this.statusUpdate.notes = '';
  }

  closeUpdateModal(): void {
    this.selectedTicket = null;
  }

  // VIVA EXPLANATION: Submits the final resolution (SUCCESS or FAILURE/DEFERRED) along with feedback notes.
  submitStatusUpdate(): void {
    if (!this.selectedTicket) return;

    this.isActionLoading = true;
    const request = {
      status: this.statusUpdate.status,
      adminNotes: this.statusUpdate.notes
    };

    this.ticketService.updateStatus(this.selectedTicket.ticketId!, request).subscribe({
      next: () => {
        this.isActionLoading = false;
        this.successMessage = `Task marked as ${this.statusUpdate.status}!`;
        this.closeUpdateModal();
        this.loadEngineerProfile();
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.isActionLoading = false;
        this.errorMessage = 'Failed to update task status.';
        console.error('Status update error:', err);
      }
    });
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
