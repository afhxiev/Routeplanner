import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Port {
  name: string;
  location: google.maps.LatLngLiteral;
  rating?: number;
  businessStatus?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortService {
  private portsSubject = new BehaviorSubject<Port[]>([]);
  ports$ = this.portsSubject.asObservable();
  
  private allPorts: Port[] = []; 

  updatePorts(ports: Port[]) {
    this.allPorts = [...ports];
    this.portsSubject.next(ports);
  }

  getCurrentPorts(): Port[] {
    return this.allPorts;
  }

  clearPorts() {
    this.allPorts = [];
    this.portsSubject.next([]);
  }
}