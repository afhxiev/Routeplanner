import { Injectable } from '@angular/core';
import { Port } from './port.service';

@Injectable({
  providedIn: 'root'
})
export class DistanceService {
  calculateTotalDistance(ports: Port[]): number {
    let totalDistance = 0;
    
    for (let i = 0; i < ports.length - 1; i++) {
      totalDistance += this.calculateDistance(
        ports[i].location.lat,
        ports[i].location.lng,
        ports[i + 1].location.lat,
        ports[i + 1].location.lng
      );
    }

    return Math.round(totalDistance * 10) / 10; // Round to 1 decimal place
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
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}