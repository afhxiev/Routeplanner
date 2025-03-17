import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Port } from './port.service';
import { environment } from 'src/environments/environment';

interface EmailRequest {
  toEmail: string;
  mapImage: string;
  ports: {
    name: string;
    rating: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = `${environment.apiUrl}/api/email`;

  constructor(private http: HttpClient) {}

  sendRouteEmail(toEmail: string, mapImage: string, ports: Port[]) {
    const request: EmailRequest = {
      toEmail,
      mapImage,
      ports: ports.map(port => ({
        name: port.name,
        rating: port.rating || 0
      }))
    };

    return this.http.post(`${this.apiUrl}/send`, request);
  }
}