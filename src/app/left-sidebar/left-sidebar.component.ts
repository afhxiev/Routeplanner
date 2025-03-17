import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteService } from '../services/route.service';
import { Port } from '../services/port.service';
import { SidebarService } from '../right-sidebar/right-sidebar.service';
import { DistanceService } from '../services/distance.service';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-left-sidebar',
  template: `
    <div class="left-sidebar">
      <button 
        class="create-route-button"
        [class.active]="filtersApplied"
        (click)="onCreateRouteClick()"
        [disabled]="!filtersApplied">
        {{ 'Generate Route' | translate }}
      </button>
      
      <div *ngIf="totalDistance > 0" class="distance-display">
        {{ 'Total Distance' | translate }}: {{totalDistance}} {{ 'km' | translate }}
      </div>

      <div class="ports-scroll-container">
        <div *ngFor="let port of selectedPorts" class="partition port-item">
          <div class="port-content">
            <span class="port-name">{{port.name}}</span>
            <span *ngIf="port.rating" class="rating">{{port.rating}}★</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .left-sidebar {
      width: calc(1/6 * 100vw);
      height: calc(80vh - 10px);
      background-color: #f7f7f7;
      border-right: 1px solid #ccc;
      display: flex;
      flex-direction: column;
    }

    .button-container {
      flex-shrink: 0;
    }

    .create-route-button {
      width: 100%;
      height: 10vh;
      border: none;
      background-color: #d1d5db;
      color: #4b5563;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: not-allowed;
      transition: all 0.3s ease;
      border-bottom: 1px solid #ccc;
      padding: 0 15px;
      text-align: center;
    }

    .create-route-button.active {
      background-color: #10b981;
      color: white;
      cursor: pointer;
    }

    .create-route-button.active:hover {
      background-color: #059669;
    }

    .distance-display {
      padding: 10px 15px;
      background-color: #10b981;
      color: white;
      font-weight: 600;
      text-align: center;
      border-bottom: 1px solid #ccc;
    }

    .ports-scroll-container {
      flex-grow: 1;
      overflow-y: auto;
      height: calc(80vh - 10vh);
    }

    .port-item {
      padding: 8px 15px;
      border-bottom: 1px solid #ccc;
      height: 8vh;
      background-color: white;
    }

    .port-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .port-name {
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rating {
      color: #ffd700;
      font-weight: bold;
      white-space: nowrap;
    }
  `],
  standalone: true,
  imports: [CommonModule, TranslatePipe]
})
export class LeftSidebarComponent {
  selectedPorts: Port[] = [];
  filtersApplied: boolean = false;
  totalDistance: number = 0;

  constructor(
    private routeService: RouteService,
    private sidebarService: SidebarService,
    private distanceService: DistanceService
  ) {
    // Subscribe to route state changes
    this.routeService.routeState$.subscribe(state => {
      this.selectedPorts = state.selectedPorts;
      if (state.selectedPorts.length > 1) {
        this.totalDistance = this.distanceService.calculateTotalDistance(state.selectedPorts);
      } else {
        this.totalDistance = 0;
      }
    });

    this.sidebarService.filters$.subscribe(filters => {
      this.filtersApplied = filters !== null;
    });
  }

  onCreateRouteClick(): void {
    if (this.filtersApplied) {
      this.routeService.startRouteGeneration();
    }
  }
}