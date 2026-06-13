import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { EngineerService } from '../../services/engineer.service';
import { AuthService } from '../../services/auth.service';
import { Ticket } from '../../models/ticket.model';
import { Engineer } from '../../models/engineer.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  engineers: Engineer[] = [];
  alertTickets: Ticket[] = []; // FAILED or DEFERRED
  
  // Dashboard stats
  stats = {
    total: 0,
    open: 0,
    inProgress: 0,
    success: 0,
    alerts: 0
  };

  currentTab = 'TICKETS'; // 'TICKETS', 'ENGINEERS', 'ALERTS'
  statusFilter = 'ALL';
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Assignment Modal State
  selectedTicket: Ticket | null = null;
  recommendedEngineer: Engineer | null = null;
  selectedEngineerId: number | null = null;
  isMatchingLoading = false;

  constructor(
    private ticketService: TicketService,
    private engineerService: EngineerService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.getRole() !== 'ADMIN') {
      this.router.navigate(['/login']);
      return;
    }
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Load tickets
    this.ticketService.getAllTickets().subscribe({
      next: (ticketList) => {
        this.tickets = ticketList.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        this.calculateStats();
        this.applyFilter();
        
        // Load engineers
        this.engineerService.getAllEngineers().subscribe({
          next: (engList) => {
            this.engineers = engList;
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Failed to load engineers:', err);
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load system data. Try again.';
        console.error('Admin load error:', err);
      }
    });
  }

  calculateStats(): void {
    this.stats.total = this.tickets.length;
    this.stats.open = this.tickets.filter(t => t.status === 'OPEN').length;
    this.stats.inProgress = this.tickets.filter(t => t.status === 'ASSIGNED' || t.status === 'ACCEPTED' || t.status === 'IN_PROGRESS').length;
    this.stats.success = this.tickets.filter(t => t.status === 'SUCCESS').length;
    this.stats.alerts = this.tickets.filter(t => t.status === 'FAILURE' || t.status === 'DEFERRED').length;

    // Alerts tickets list
    this.alertTickets = this.tickets.filter(t => t.status === 'FAILURE' || t.status === 'DEFERRED');
  }

  applyFilter(): void {
    if (this.statusFilter === 'ALL') {
      this.filteredTickets = this.tickets;
    } else {
      this.filteredTickets = this.tickets.filter(t => t.status === this.statusFilter);
    }
  }

  setTab(tab: string): void {
    this.currentTab = tab;
  }

  openAssignModal(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.recommendedEngineer = null;
    this.selectedEngineerId = null;
  }

  closeAssignModal(): void {
    this.selectedTicket = null;
    this.recommendedEngineer = null;
    this.selectedEngineerId = null;
  }

  findBestMatch(): void {
    if (!this.selectedTicket) return;
    
    this.isMatchingLoading = true;
    this.errorMessage = null;

    const request = {
      faultLatitude: this.selectedTicket.latitude || 12.9716,
      faultLongitude: this.selectedTicket.longitude || 77.5946,
      serviceType: this.selectedTicket.ticketType
    };

    this.engineerService.findBestMatch(request).subscribe({
      next: (bestEng) => {
        this.isMatchingLoading = false;
        this.recommendedEngineer = bestEng;
        this.selectedEngineerId = bestEng.engineerId || null;
      },
      error: (err) => {
        this.isMatchingLoading = false;
        this.errorMessage = 'No available technicians match criteria.';
        console.error('Match recommendation error:', err);
      }
    });
  }

  assignTicket(): void {
    if (!this.selectedTicket || !this.selectedEngineerId) return;

    this.isLoading = true;
    const selectedEng = this.engineers.find(e => e.engineerId === this.selectedEngineerId);
    if (!selectedEng) {
      this.isLoading = false;
      return;
    }

    const request = {
      engineerId: selectedEng.engineerId!,
      engineerName: selectedEng.name
    };

    const isReassign = this.selectedTicket.status === 'DEFERRED';

    const assignObservable = isReassign
      ? this.ticketService.reassignTicket(this.selectedTicket.ticketId!, request)
      : this.ticketService.assignEngineer(this.selectedTicket.ticketId!, request);

    assignObservable.subscribe({
      next: (updatedTicket) => {
        this.isLoading = false;
        this.successMessage = `Successfully assigned to ${selectedEng.name}!`;
        this.closeAssignModal();
        this.loadData();
        
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to assign ticket. Please try again.';
        console.error('Assignment error:', err);
      }
    });
  }

  getPriorityClass(priority: string): string {
    return `badge-${priority.toLowerCase()}`;
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'SUCCESS': return 'badge-success';
      case 'FAILED':
      case 'FAILURE': return 'badge-danger';
      case 'OPEN': return 'badge-info';
      case 'DEFERRED': return 'badge-warning';
      default: return 'badge-medium';
    }
  }

  // Calculate distance between two lat/lng coordinates (FR13 distance visual helper)
  getDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
    const R = 6371; // Radius of earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d.toFixed(2) + ' km';
  }
}
