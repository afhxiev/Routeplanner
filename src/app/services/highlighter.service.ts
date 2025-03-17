import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PortService, Port } from '../services/port.service';

@Injectable({
  providedIn: 'root'
})
export class HighlighterService {
  private map?: google.maps.Map;
  private drawingManager?: google.maps.drawing.DrawingManager;
  private isDrawingModeActive = new BehaviorSubject<boolean>(false);
  isDrawingModeActive$ = this.isDrawingModeActive.asObservable();
  private currentPolygon?: google.maps.Polygon;
  private instructionWindow?: google.maps.InfoWindow;

  constructor(private portService: PortService) {}

  async initDrawingManager(map: google.maps.Map) { //activates when HighlighterService class is called, so when Highlighter button is clicked.
    this.map = map;
    const drawingLib = await google.maps.importLibrary("drawing") as google.maps.DrawingLibrary;
    
    this.drawingManager = new drawingLib.DrawingManager({  //polygon 'backgroung' is light red
      drawingMode: null,
      drawingControl: false,
      polygonOptions: {
        fillColor: '#FF0000',
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: '#FF0000',
        clickable: false,
        editable: true,
        zIndex: 1
      }
    });

    this.drawingManager.setMap(map);

    //listener for when polygon is completed
    google.maps.event.addListener(this.drawingManager, 'polygoncomplete', (polygon: google.maps.Polygon) => {
      this.currentPolygon = polygon;
      //shows message that polygon is completed
      this.showCompletionMessage();
      //fetches ports after short delay
      setTimeout(() => this.handlePolygonComplete(polygon), 1000);
      this.deactivateDrawingMode();
    });
  }

  activateDrawingMode() {
    if (this.drawingManager && this.map) {
      this.clearCurrentPolygon();
      //clears previously drawn polygons if new polygon drawing is started
      this.portService.clearPorts();
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      this.isDrawingModeActive.next(true);
      //changes cursor to crosshair
      this.map.setOptions({
        draggableCursor: 'crosshair'
      });
      //shows instruction tooltip
      this.showInstructions();
    }
  }

  deactivateDrawingMode() {
    if (this.drawingManager && this.map) {
      this.drawingManager.setDrawingMode(null);
      this.isDrawingModeActive.next(false);
      
      // Reset cursor
      this.map.setOptions({
        draggableCursor: null
      });

      // Close instruction window if it's open
      if (this.instructionWindow) {
        this.instructionWindow.close();
        this.instructionWindow = undefined;
      }
    }
  }

  clearCurrentPolygon() {
    if (this.currentPolygon) {
      this.currentPolygon.setMap(null);
      this.currentPolygon = undefined;
    }
  }

  private showInstructions() {
    if (this.map) {
      if (this.instructionWindow) {
        this.instructionWindow.close();
      }

      this.instructionWindow = new google.maps.InfoWindow({
        content: 'Click on the map to start drawing. Click points to create a polygon. Double-click to finish.',
        position: this.map.getCenter()
      });

      this.instructionWindow.open(this.map);

      setTimeout(() => {
        if (this.instructionWindow) {
          this.instructionWindow.close();
          this.instructionWindow = undefined;
        }
      }, 5000);
    }
  }

  private showCompletionMessage() {
    if (this.map) {
      const completionWindow = new google.maps.InfoWindow({
        content: 'Polygon drawn successfully! Searching for ports...',
        position: this.map.getCenter()
      });

      completionWindow.open(this.map);
      setTimeout(() => completionWindow.close(), 2000);
    }
  }

  private async handlePolygonComplete(polygon: google.maps.Polygon) {
    if (!this.map) return;

    const bounds = new google.maps.LatLngBounds();
    const path = polygon.getPath();
    path.forEach((point) => bounds.extend(point));

    const center = bounds.getCenter();
    const ne = bounds.getNorthEast();
    const radius = google.maps.geometry.spherical.computeDistanceBetween(center, ne);

    const placesLib = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
    const Place = placesLib.Place;

    const request = {
      fields: ["displayName", "location", "businessStatus", "rating"],
      locationRestriction: {
        center: center,
        radius: radius
      },
      includedPrimaryTypes: ["marina"],
      maxResultCount: 20,
      rankPreference: google.maps.places.SearchNearbyRankPreference.DISTANCE
    };

    try {
      const { places } = await Place.searchNearby(request);
      const portsInPolygon = places.filter(place => {
        return google.maps.geometry.poly.containsLocation(
          place.location,
          polygon
        );
      });

      const ports: Port[] = portsInPolygon.map(place => ({
        name: place.displayName,
        location: place.location.toJSON(),
        businessStatus: place.businessStatus,
        rating: place.rating || 0
      }));

      // Update ports in service
      this.portService.updatePorts(ports);

      // Show results message
      if (this.map) {
        const resultsWindow = new google.maps.InfoWindow({
          content: `Found ${ports.length} ports in the selected area`,
          position: center
        });

        resultsWindow.open(this.map);
        setTimeout(() => resultsWindow.close(), 3000);
      }

    } catch (error) {
      console.error('Error fetching ports within polygon:', error);
      
      if (this.map) {
        const errorWindow = new google.maps.InfoWindow({
          content: 'Error fetching ports. Please try again.',
          position: this.map.getCenter()
        });

        errorWindow.open(this.map);
        setTimeout(() => errorWindow.close(), 3000);
      }
    }
  }
}