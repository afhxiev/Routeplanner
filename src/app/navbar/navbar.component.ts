import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ShareModalComponent } from '../share-modal/share-modal.component';
import { LanguageDropdownComponent } from '../language-dropdown/language-dropdown.component';
import { TranslatePipe } from '../pipes/translate.pipe';
import { RouteService } from '../services/route.service';
import { Port } from '../services/port.service';
import { MapCaptureService } from '../services/map-capture.service';
import { DistanceService } from '../services/distance.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    InfoModalComponent, 
    ShareModalComponent, 
    LanguageDropdownComponent, 
    TranslatePipe
  ],
  template: `
    <div class="navbar">
      <app-language-dropdown class="nav-segment"></app-language-dropdown>
      <div 
        class="nav-segment share-button" 
        [class.active]="isRouteComplete"
        (click)="toggleShareModal()">
        {{ 'Share Route' | translate }}
      </div>
      <div class="nav-segment" (click)="toggleInfoModal()">
        {{ 'Info' | translate }}
      </div>
    </div>
    
    <app-info-modal 
      *ngIf="showInfoModal" 
      (close)="toggleInfoModal()">
    </app-info-modal>

    <app-share-modal
      *ngIf="showShareModal"
      [selectedPorts]="selectedPorts"
      [mapImageUrl]="mapImageUrl"
      [totalDistance]="totalDistance"
      (close)="toggleShareModal()">
    </app-share-modal>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 20vh;
      background-color: #f0f0f0;
    }

    .nav-segment {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border: 1px solid #ccc;
      font-size: 1.1rem;
      font-weight: 500;
      color: #4b5563;
      transition: all 0.3s ease;
      background-color: white;
    }

    .nav-segment:hover {
      background-color: #f3f4f6;
    }

    .share-button {
      background-color: #d1d5db;
      color: white;
      cursor: not-allowed;
    }

    .share-button.active {
      background-color: #10b981;
      cursor: pointer;
    }

    .share-button.active:hover {
      background-color: #059669;
    }
  `]
})
export class NavbarComponent {
  showInfoModal = false;
  showShareModal = false;
  isRouteComplete = false;
  selectedPorts: Port[] = [];
  mapImageUrl: string = '';
  totalDistance: number = 0;

  constructor(
    private routeService: RouteService,
    private mapCaptureService: MapCaptureService,
    private distanceService: DistanceService
  ) {
    // Subscribe to route state changes
    this.routeService.routeState$.subscribe(state => {
      console.log('Route state updated:', state);
      this.isRouteComplete = !state.isGenerating && state.selectedPorts.length > 0;
      this.selectedPorts = state.selectedPorts;

      if (this.selectedPorts.length > 1) {
        this.totalDistance = this.distanceService.calculateTotalDistance(this.selectedPorts);
      }

      if (this.isRouteComplete) {
        this.captureMapImage();
      }
    });

    // Subscribe to map image updates
    this.mapCaptureService.mapImage$.subscribe(imageUrl => {
      if (imageUrl) {
        this.mapImageUrl = imageUrl;
      }
    });
  }

  toggleInfoModal(): void {
    this.showInfoModal = !this.showInfoModal;
  }

  toggleShareModal(): void {
    console.log('Toggle share modal. Route complete:', this.isRouteComplete);
    if (!this.isRouteComplete) return;
    this.showShareModal = !this.showShareModal;
    console.log('Share modal visibility:', this.showShareModal);
  }

  private async captureMapImage() {
    const mapElement = document.querySelector('.map-container') as HTMLElement;
    if (mapElement) {
      await this.mapCaptureService.captureMap(mapElement);
    } else {
      console.error('Map element not found');
    }
  }
}