import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class MapCaptureService {
  private mapImageSubject = new BehaviorSubject<string>('');
  mapImage$ = this.mapImageSubject.asObservable();

  async captureMap(mapElement: HTMLElement) {
    try {
      console.log('Capturing map...');
      const canvas = await html2canvas(mapElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2, 
      });

      const imageUrl = canvas.toDataURL('image/png');
      console.log('Map captured successfully');
      this.mapImageSubject.next(imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Error capturing map:', error);
      return '';
    }
  }
}