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

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrls: ['./map.css']
})
export class MapComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() center: [number, number] = [12.9716, 77.5946]; // Bangalore default
  @Input() zoom = 12;
  @Input() markers: MapMarker[] = [];
  @Input() routePoints: [number, number][] = []; // Draw line if provided

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private map: L.Map | null = null;
  private markerGroup: L.LayerGroup | null = null;
  private routeLine: L.Polyline | null = null;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
  }

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

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initMap(): void {
    if (this.map) return;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: this.center,
      zoom: this.zoom,
      zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
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

  private updateMarkers(): void {
    if (!this.map || !this.markerGroup) return;

    this.markerGroup.clearLayers();

    if (this.markers.length === 0) return;

    const bounds: L.LatLngExpression[] = [];

    this.markers.forEach(m => {
      if (!m.latitude || !m.longitude) return;
      
      const pos: L.LatLngExpression = [m.latitude, m.longitude];
      bounds.push(pos);

      const customIcon = this.createSvgIcon(m.type);
      const marker = L.marker(pos, { icon: customIcon });
      
      if (m.popupText) {
        marker.bindPopup(`<div class="map-popup-content">${m.popupText}</div>`);
      }
      
      this.markerGroup?.addLayer(marker);
    });

    // Fit bounds if multiple markers are present
    if (bounds.length > 1 && this.map) {
      this.map.fitBounds(L.latLngBounds(bounds), { padding: [50, 50] });
    }
  }

  private updateRoute(): void {
    if (!this.map) return;

    if (this.routeLine) {
      this.routeLine.remove();
      this.routeLine = null;
    }

    if (this.routePoints && this.routePoints.length >= 2) {
      const latLngs = this.routePoints.map(p => L.latLng(p[0], p[1]));
      this.routeLine = L.polyline(latLngs, {
        color: '#00f2fe',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8', // Animated dashes look
        lineCap: 'round'
      }).addTo(this.map);

      this.map.fitBounds(this.routeLine.getBounds(), { padding: [40, 40] });
    }
  }

  private createSvgIcon(type: string): L.DivIcon {
    let color = '#00b0ff'; // Default blue
    let symbol = '📍';

    switch (type) {
      case 'engineer':
        color = '#6f42c1'; // Purple
        symbol = '👷';
        break;
      case 'ticket_open':
        color = '#00b0ff'; // Light Blue
        symbol = '📥';
        break;
      case 'ticket_progress':
        color = '#ffb300'; // Amber/Orange
        symbol = '⚡';
        break;
      case 'ticket_success':
        color = '#00e676'; // Green
        symbol = '✅';
        break;
      case 'ticket_failure':
        color = '#ff1744'; // Red
        symbol = '❌';
        break;
      case 'hazard_low':
        color = '#00e676';
        symbol = '⚠️';
        break;
      case 'hazard_medium':
        color = '#ffb300';
        symbol = '⚠️';
        break;
      case 'hazard_high':
        color = '#ff9100';
        symbol = '⚠️';
        break;
      case 'hazard_critical':
        color = '#ff1744';
        symbol = '☠️';
        break;
    }

    const htmlContent = `
      <div class="custom-map-pin" style="--pin-color: ${color}">
        <span class="pin-symbol">${symbol}</span>
        <div class="pin-pulse" style="--pulse-color: ${color}"></div>
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
