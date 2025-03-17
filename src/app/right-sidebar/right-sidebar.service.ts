import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PortService, Port } from '../services/port.service';

export interface FilterValues {
  lengthOfTrip: number;
  differentPorts: number;
  islands: boolean;
  rating: number;
  averageDistance: number;
}

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isSidebarOpenSubject = new BehaviorSubject<boolean>(false);
  isSidebarOpen$ = this.isSidebarOpenSubject.asObservable();

  private filtersSubject = new BehaviorSubject<FilterValues | null>(null);
  filters$ = this.filtersSubject.asObservable();

  constructor(private portService: PortService) {}

  toggleSidebar(): void {
    this.isSidebarOpenSubject.next(!this.isSidebarOpenSubject.value);
  }

  closeSidebar(): void {
    this.isSidebarOpenSubject.next(false);
  }

  openSidebar(): void {
    this.isSidebarOpenSubject.next(true);
  }

  applyFilters(filters: FilterValues): void {
    console.log('Applying filters:', filters);
    this.filtersSubject.next(filters);
    this.filterPorts(filters);
  }

  private filterPorts(filters: FilterValues): void {
    const currentPorts = this.portService.getCurrentPorts();
    console.log('Initial ports count:', currentPorts.length);
    
    
    let filteredPorts = currentPorts.filter(port => {
      const meetsRating = (port.rating || 0) >= filters.rating;
      if (!meetsRating) {
        console.log(`Port ${port.name} removed: rating ${port.rating} below minimum ${filters.rating}`);
      }
      return meetsRating;
    });
    
    console.log('Ports after rating filter:', filteredPorts.length);

    
    if (filters.averageDistance > 0) {
      filteredPorts = this.filterByAverageDistance(filteredPorts, filters.averageDistance);
      console.log('Ports after distance filter:', filteredPorts.length);
    }

    
    this.portService.updatePorts(filteredPorts);
  }

  private filterByAverageDistance(ports: Port[], minAverageDistance: number): Port[] {
    return ports.filter(port => {
      const avgDistance = this.calculateAverageDistance(port, ports);
      const shouldKeep = avgDistance >= minAverageDistance;
      if (!shouldKeep) {
        console.log(`Port ${port.name} removed: average distance ${avgDistance.toFixed(2)}km below minimum ${minAverageDistance}km`);
      }
      return shouldKeep;
    });
  }

  private calculateAverageDistance(port: Port, allPorts: Port[]): number {
    const otherPorts = allPorts.filter(p => 
      p.location.lat !== port.location.lat || 
      p.location.lng !== port.location.lng
    );

    if (otherPorts.length === 0) return 0;

    const totalDistance = otherPorts.reduce((sum, otherPort) => {
      return sum + this.calculateDistance(
        port.location.lat,
        port.location.lng,
        otherPort.location.lat,
        otherPort.location.lng
      );
    }, 0);

    const avgDistance = totalDistance / otherPorts.length;
    console.log(`Port ${port.name} average distance: ${avgDistance.toFixed(2)}km`);
    return avgDistance;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}