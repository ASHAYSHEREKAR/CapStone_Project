import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EngineerService } from '../../services/engineer.service';
import { AuthService } from '../../services/auth.service';
import { Hazard } from '../../models/engineer.model';
import { MapComponent, MapMarker } from '../map/map';

// VIVA EXPLANATION: Area coordinates dictionary to map hazard locations to coordinates.
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
// VIVA EXPLANATION: What does HazardManagementComponent do?
// - Purpose: Allows administrators and engineers to log field hazards (electric shocks, waterlogging, loose cables)
//   and view their physical coordinates on the Leaflet map overlay.
// - Integration: Communicates with the Engineer/Hazard microservice on port 8083.
// ----------------------------------------------------
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

  // Modal form states
  showForm = false;
  isEditMode = false;
  currentHazard: Hazard = this.initHazard();
  
  userRole: string | null = null;
  currentEngineerId: number | null = null;
  currentEngineerName: string = '';

  bangaloreAreas = Object.keys(BANGALORE_COORDINATES);

  constructor(
    private engineerService: EngineerService,
    private authService: AuthService,
    private router: Router
  ) {}

  // VIVA EXPLANATION: Ensures only authenticated ADMIN or ENGINEER users can view hazards.
  ngOnInit(): void {
    const role = this.authService.getRole();
    if (role !== 'ADMIN' && role !== 'ENGINEER') {
      this.router.navigate(['/login']);
      return;
    }
    this.userRole = role;
    this.loadHazards();
    
    // If user is engineer, pre-populate their reporter profile details.
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

  // VIVA EXPLANATION: Initializes empty hazard template.
  initHazard(): Hazard {
    return {
      location: 'Koramangala',
      latitude: 12.9352,
      longitude: 77.6245,
      hazardType: 'Electrical',
      description: '',
      severity: 'LOW',
      reportedBy: undefined,
      reporterName: ''
    };
  }

  // VIVA EXPLANATION: Hits GET http://localhost:8083/api/hazards to list active hazards.
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

  // VIVA EXPLANATION: Builds marker lists to feed into Leaflet.
  updateMapMarkers(): void {
    this.mapMarkers = this.hazards.map(h => ({
      latitude: h.latitude || 12.9716,
      longitude: h.longitude || 77.5946,
      type: this.getMapMarkerType(h.severity),
      popupText: `
        <strong>${h.hazardType} Hazard</strong><br/>
        Location: ${h.location}<br/>
        Severity: ${h.severity}<br/>
        Description: ${h.description}<br/>
        <span style="font-size:0.8rem;color:#666">Reported by: ${h.reporterName || 'System'}</span>
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

  // VIVA EXPLANATION: Saves a new or updated hazard. Maps coordinates of the selected area beforehand.
  onSubmit(): void {
    if (!this.currentHazard.location || !this.currentHazard.description) {
      this.errorMessage = 'Please fill in location and description.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Retrieve coordinates for selected location
    const coords = BANGALORE_COORDINATES[this.currentHazard.location] || { lat: 12.9716, lng: 77.5946 };
    this.currentHazard.latitude = coords.lat;
    this.currentHazard.longitude = coords.lng;

    if (this.isEditMode) {
      // Calls PUT http://localhost:8083/api/hazards/{id}
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
      // Calls POST http://localhost:8083/api/hazards
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

  // VIVA EXPLANATION: Hits DELETE http://localhost:8083/api/hazards/{id} (called by Admin).
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
