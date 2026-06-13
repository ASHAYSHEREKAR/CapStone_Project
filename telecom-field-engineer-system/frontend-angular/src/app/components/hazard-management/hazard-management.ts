import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EngineerService } from '../../services/engineer.service';
import { AuthService } from '../../services/auth.service';
import { Hazard } from '../../models/engineer.model';
import { MapComponent, MapMarker } from '../map/map';

@Component({
  selector: 'app-hazard-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MapComponent],
  templateUrl: './hazard-management.html',
  styleUrls: ['./hazard-management.css']
})
export class HazardManagementComponent implements OnInit {
  hazards: Hazard[] = [];
  mapMarkers: MapMarker[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Form states
  showForm = false;
  isEditMode = false;
  currentHazard: Hazard = this.initHazard();
  
  userRole: string | null = null;
  currentEngineerId: number | null = null;
  currentEngineerName: string = '';

  constructor(
    private engineerService: EngineerService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const role = this.authService.getRole();
    if (role !== 'ADMIN' && role !== 'ENGINEER') {
      this.router.navigate(['/login']);
      return;
    }
    this.userRole = role;
    this.loadHazards();
    
    if (role === 'ENGINEER') {
      const user = this.authService.getCurrentUser();
      if (user && user.email) {
        this.engineerService.getEngineerByEmail(user.email).subscribe({
          next: (eng) => {
            if (eng) {
              this.currentEngineerId = eng.engineerId || null;
              this.currentEngineerName = eng.name;
            }
          },
          error: (err) => console.error('Error fetching engineer profile for hazard reporting:', err)
        });
      }
    }
  }

  initHazard(): Hazard {
    return {
      location: '',
      latitude: 12.9716, // Default Bangalore
      longitude: 77.5946,
      hazardType: 'Electrical',
      description: '',
      severity: 'LOW',
      reportedBy: undefined,
      reporterName: ''
    };
  }

  loadHazards(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.engineerService.getAllHazards().subscribe({
      next: (list) => {
        this.hazards = list.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        this.updateMapMarkers();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load hazards from system.';
        console.error(err);
      }
    });
  }

  updateMapMarkers(): void {
    this.mapMarkers = this.hazards.map(h => ({
      latitude: h.latitude || 12.9716,
      longitude: h.longitude || 77.5946,
      type: this.getMapMarkerType(h.severity),
      popupText: `
        <h4>${h.hazardType} Hazard</h4>
        <p><strong>Location:</strong> ${h.location}</p>
        <p><strong>Severity:</strong> <span class="badge badge-${h.severity.toLowerCase()}">${h.severity}</span></p>
        <p><strong>Description:</strong> ${h.description}</p>
        <p class="text-xs text-muted">Reported by: ${h.reporterName || 'System'}</p>
      `
    }));
  }

  getMapMarkerType(severity: string): any {
    switch (severity) {
      case 'CRITICAL': return 'hazard_critical';
      case 'HIGH': return 'hazard_high';
      case 'MEDIUM': return 'hazard_medium';
      default: return 'hazard_low';
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentHazard = this.initHazard();
    if (this.userRole === 'ENGINEER') {
      this.currentHazard.reportedBy = this.currentEngineerId || undefined;
      this.currentHazard.reporterName = this.currentEngineerName;
    } else {
      this.currentHazard.reporterName = 'Administrator';
    }
    this.showForm = true;
  }

  openEditModal(hazard: Hazard): void {
    this.isEditMode = true;
    this.currentHazard = { ...hazard };
    this.showForm = true;
  }

  closeModal(): void {
    this.showForm = false;
  }

  onSubmit(): void {
    if (!this.currentHazard.location || !this.currentHazard.description) {
      this.errorMessage = 'Please fill in location and description.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    if (this.isEditMode) {
      this.engineerService.updateHazard(this.currentHazard.hazardId!, this.currentHazard).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Hazard updated successfully!';
          this.showForm = false;
          this.loadHazards();
          this.clearMessages();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to update hazard.';
          console.error(err);
        }
      });
    } else {
      this.engineerService.addHazard(this.currentHazard).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Hazard reported successfully!';
          this.showForm = false;
          this.loadHazards();
          this.clearMessages();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to report hazard.';
          console.error(err);
        }
      });
    }
  }

  deleteHazard(id: number): void {
    if (!confirm('Are you sure you want to delete this hazard report?')) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.engineerService.deleteHazard(id).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Hazard deleted successfully!';
        this.loadHazards();
        this.clearMessages();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to delete hazard.';
        console.error(err);
      }
    });
  }

  clearMessages(): void {
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  getSeverityClass(severity: string): string {
    return `badge-${severity.toLowerCase()}`;
  }
}
