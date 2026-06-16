import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

export interface MapMarker {
  latitude: number;
  longitude: number;
  popupText: string;
  type: 'engineer' | 'ticket_open' | 'ticket_progress' | 'ticket_success' | 'ticket_failure' | 'hazard_low' | 'hazard_medium' | 'hazard_high' | 'hazard_critical';
  title?: string;
}

// ----------------------------------------------------
// VIVA EXPLANATION: What is MapComponent?
// - Purpose: Encapsulates Leaflet Map operations.
// - Reusability: Used as a standalone component in dashboards and safety center views.
// - Markers: Plotted dynamically from coordinates (lat/lng) sent by backend APIs.
// - Route drawing: Supports drawing straight dash lines between two coordinates (e.g. technician and customer).
// ----------------------------------------------------
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrls: ['./map.css']
})
export class MapComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() center: [number, number] = [12.9716, 77.5946]; // Bangalore coordinates center by default
  @Input() zoom = 12;
  @Input() markers: MapMarker[] = [];
  @Input() routePoints: [number, number][] = []; // Latitude/longitude coordinate points to draw lines

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private map: L.Map | null = null;
  private markerGroup: L.LayerGroup | null = null;
  private routeLine: L.Polyline | null = null;

  ngOnInit(): void {}

  // VIVA EXPLANATION: Initializes Leaflet map immediately after the HTML view mounts.
  ngAfterViewInit(): void {
    this.initMap();
  }

  // VIVA EXPLANATION: Detects when inputs (like markers list) change dynamically and updates map views automatically.
  ngOnChanges(changes: SimpleChanges): void {
    if (this.map) {
      if (changes['center'] && !changes['center'].isFirstChange()) {
        this.map.setView(this.center, this.zoom);
      }
      if (changes['markers']) {
        this.updateMarkers();
      }
      if (changes['routePoints']) {
        this.updateRoute();
      }
    }
  }

  // VIVA EXPLANATION: Destroys Leaflet map instance when navigating away to prevent memory leaks.
  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  // VIVA EXPLANATION: Initializes map parameters, default zoom, coordinates center, and loads tile layers.
  private initMap(): void {
    if (this.map) return;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: this.center,
      zoom: this.zoom,
      zoomControl: true
    });

    // VIVA EXPLANATION: Uses OpenStreetMap standard tile layers.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);

    this.markerGroup = L.layerGroup().addTo(this.map);
    this.updateMarkers();
    this.updateRoute();

    // Trigger map invalidation to ensure proper rendering inside dynamic containers/tabs
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 200);
  }

  // VIVA EXPLANATION: Adds pins/markers to the map container for each active item in markers array.
  private updateMarkers(): void {
    if (!this.map || !this.markerGroup) return;

    this.markerGroup.clearLayers();

    if (this.markers.length === 0) return;

    const bounds: L.LatLngExpression[] = [];

    this.markers.forEach(m => {
      if (!m.latitude || !m.longitude) return;
      
      const pos: L.LatLngExpression = [m.latitude, m.longitude];
      bounds.push(pos);

      // Create a colored SVG pin depending on type
      const customIcon = this.createSvgIcon(m.type);
      const marker = L.marker(pos, { icon: customIcon });
      
      if (m.popupText) {
        marker.bindPopup(`<div class="map-popup-content">${m.popupText}</div>`);
      }
      
      this.markerGroup?.addLayer(marker);
    });

    // Auto-adjust zoom level to fit all pins inside the viewport.
    if (bounds.length > 1 && this.map) {
      this.map.fitBounds(L.latLngBounds(bounds), { padding: [50, 50] });
    }
  }

  // VIVA EXPLANATION: Draws route lines between points (e.g. tracking field engineer traveling to ticket site).
  private updateRoute(): void {
    if (!this.map) return;

    if (this.routeLine) {
      this.routeLine.remove();
      this.routeLine = null;
    }

    if (this.routePoints && this.routePoints.length >= 2) {
      const latLngs = this.routePoints.map(p => L.latLng(p[0], p[1]));
      this.routeLine = L.polyline(latLngs, {
        color: '#007bff',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8', // Dashed line style
        lineCap: 'round'
      }).addTo(this.map);

      this.map.fitBounds(this.routeLine.getBounds(), { padding: [40, 40] });
    }
  }

  // VIVA EXPLANATION: Generates dynamic emoji marker pins inside a custom div container.
  private createSvgIcon(type: string): L.DivIcon {
    let color = '#007bff'; // Default Blue
    let symbol = '📍';

    switch (type) {
      case 'engineer':
        color = '#6f42c1'; // Purple
        symbol = '👷';
        break;
      case 'ticket_open':
        color = '#17a2b8'; // Teal
        symbol = '📥';
        break;
      case 'ticket_progress':
        color = '#ffc107'; // Yellow
        symbol = '⚡';
        break;
      case 'ticket_success':
        color = '#28a745'; // Green
        symbol = '✅';
        break;
      case 'ticket_failure':
        color = '#dc3545'; // Red
        symbol = '❌';
        break;
      case 'hazard_low':
        color = '#28a745';
        symbol = '⚠️';
        break;
      case 'hazard_medium':
        color = '#ffc107';
        symbol = '⚠️';
        break;
      case 'hazard_high':
        color = '#fd7e14'; // Orange
        symbol = '⚠️';
        break;
      case 'hazard_critical':
        color = '#dc3545';
        symbol = '☠️';
        break;
    }

    const htmlContent = `
      <div class="custom-map-pin" style="--pin-color: ${color}">
        <span class="pin-symbol">${symbol}</span>
      </div>
    `;

    return L.divIcon({
      html: htmlContent,
      className: 'custom-leaflet-icon-container',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36]
    });
  }
}
