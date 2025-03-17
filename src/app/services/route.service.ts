import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Port } from './port.service';
import { SidebarService, FilterValues } from '../right-sidebar/right-sidebar.service';

export interface RouteState {
  isGenerating: boolean;
  selectedPorts: Port[];
  startingPort?: Port;
  currentFilters?: FilterValues;
  polylines: google.maps.Polyline[];
}

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private state: RouteState = {
    isGenerating: false,
    selectedPorts: [],
    polylines: []
  };

  private routeStateSubject = new BehaviorSubject<RouteState>(this.state);
  routeState$ = this.routeStateSubject.asObservable();

  constructor(private sidebarService: SidebarService) {
    this.sidebarService.filters$.subscribe(filters => {
      if (filters) {
        this.state.currentFilters = filters;
        this.routeStateSubject.next(this.state);
      }
    });
  }

  startRouteGeneration(): void {
    if (!this.state.currentFilters) {
      alert('Please set filters before generating a route');
      return;
    }
    
    this.state = {
      ...this.state,
      isGenerating: true,
      selectedPorts: [],
      polylines: []
    };
    this.routeStateSubject.next(this.state);
  }

  selectPort(port: Port, map: google.maps.Map): void {
    if (!this.state.isGenerating || !this.state.currentFilters) return;
    const portIndex = this.findPortIndex(port);
    const isLastPort = this.state.selectedPorts.length === this.state.currentFilters.lengthOfTrip - 1;
    const isStartingPort = port === this.state.startingPort;
    
    
    if (portIndex !== -1 && !(isLastPort && isStartingPort)) {
      if (portIndex === this.state.selectedPorts.length - 1) {
        if (this.state.polylines.length > 0) {
          const lastPolyline = this.state.polylines[this.state.polylines.length - 1];
          lastPolyline.setMap(null);
          this.state.polylines.pop();
        }
        this.state.selectedPorts.pop();
        this.routeStateSubject.next(this.state);
      }
      return;
    }
    if (!this.state.startingPort) {
      this.state.startingPort = port;
      this.state.selectedPorts = [port];
      this.routeStateSubject.next(this.state);
      return;
    }
    if (this.state.selectedPorts.length >= this.state.currentFilters.lengthOfTrip) {
      return;
    }
    const previousPort = this.state.selectedPorts[this.state.selectedPorts.length - 1];
    if (previousPort) {
      const polyline = new google.maps.Polyline({
        path: [previousPort.location, port.location],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
      });
      this.state.polylines.push(polyline);
    }
    this.state.selectedPorts.push(port); //add this port to the selected ports 
    if (this.state.selectedPorts.length === this.state.currentFilters.lengthOfTrip) { //check if the route  is complete
      const uniquePorts = new Set(this.state.selectedPorts.map(p => p.name)).size;
      if (uniquePorts >= this.state.currentFilters.differentPorts) {
        this.completeRoute();
      }
    }
    this.routeStateSubject.next(this.state);
  }
  private findPortIndex(port: Port): number {
    return this.state.selectedPorts.findIndex(p => 
      p.location.lat === port.location.lat && 
      p.location.lng === port.location.lng
    );
  }
  private completeRoute(): void {
    this.state = {
      ...this.state,
      isGenerating: false
    };
    alert('Route completed successfully!');
    this.routeStateSubject.next(this.state);
  }

  getPortsRemaining(): number {
    if (!this.state.currentFilters) return 0;
    return this.state.currentFilters.lengthOfTrip - this.state.selectedPorts.length;
  }

  getSelectedPorts(): Port[] {
    return this.state.selectedPorts;
  }

  isRouteGenerating(): boolean {
    return this.state.isGenerating;
  }

  isRouteComplete(): boolean {
    return this.state.selectedPorts.length === (this.state.currentFilters?.lengthOfTrip || 0);
  }

  clearRoute(): void {
    // Clear polylines from map
    this.state.polylines.forEach(line => line.setMap(null));

    this.state = {
      isGenerating: false,
      selectedPorts: [],
      polylines: [],
      currentFilters: this.state.currentFilters
    };
    this.routeStateSubject.next(this.state);
  }
}