import { Component, OnInit, PLATFORM_ID, Inject, NgZone, ElementRef } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PortService, Port } from '../services/port.service';
import { HighlighterService } from '../services/highlighter.service';
import { RouteService } from '../services/route.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: true,
  imports: [GoogleMapsModule, CommonModule]
})
export class MapComponent implements OnInit {
  map?: google.maps.Map;
  markers: google.maps.Marker[] = [];
  infoWindow?: google.maps.InfoWindow;
  private routeInfoWindow?: google.maps.InfoWindow;
  private startingPortWindow?: google.maps.InfoWindow;
  private remainingPortsWindow?: google.maps.InfoWindow;

  center: google.maps.LatLngLiteral = {
    lat: 40.7128,
    lng: -74.0060
  };

  zoom = 11;

  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 4,
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private portService: PortService,
    private ngZone: NgZone,
    private highlighterService: HighlighterService,
    private elementRef: ElementRef,
    private routeService: RouteService
  ) {
    this.routeService.routeState$.subscribe(state => {
      if (state.isGenerating) {
        // Update all markers to reflect current selection state
        this.markers.forEach(marker => {
          const markerPosition = marker.getPosition()?.toJSON();
          if (markerPosition) {
            const port = { location: markerPosition, name: marker.getTitle() || '' } as Port;
            this.updateMarkerForRoute(marker, port);
          }
        });
        this.showRemainingPortsInfo(state.selectedPorts.length);
      }
    });
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.initMap();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.map?.setCenter(this.center);
        });
      }

      // Subscribe to port updates
      this.portService.ports$.subscribe(ports => {
        this.updateMarkers(ports);
      });
    }
  }

  async initMap() {
    try {
      console.log('Initializing map...');
      const mapLib = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      const Map = mapLib.Map;
      const InfoWindow = mapLib.InfoWindow;

      const mapElement = this.elementRef.nativeElement.querySelector('.map-container') as HTMLElement;
      if (!mapElement) {
        console.error('Map container not found');
        return;
      }

      console.log('Creating map instance...');
      this.map = new Map(mapElement, {
        center: this.center,
        zoom: this.zoom,
        ...this.options
      });

      this.infoWindow = new InfoWindow();

      console.log('Initializing highlighter service...');
      await this.highlighterService.initDrawingManager(this.map);

      console.log('Map and drawing manager initialized successfully');

      this.map.addListener('center_changed', () => {
        const newCenter = this.map?.getCenter();
        if (newCenter) {
          this.center = {
            lat: newCenter.lat(),
            lng: newCenter.lng()
          };
        }
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  private updateMarkers(ports: Port[]) {
    this.clearMarkers();

    ports.forEach(port => {
      const marker = new google.maps.Marker({
        position: port.location,
        map: this.map,
        title: port.name,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
      });

      // Add click listener for route generation
      marker.addListener('click', () => {
        if (this.routeService.isRouteGenerating()) {
          this.routeService.selectPort(port, this.map!);
          this.updateMarkerForRoute(marker, port);
        }
      });

      marker.addListener('mouseover', () => {
        this.ngZone.run(() => {
          if (this.infoWindow) {
            this.infoWindow.setContent(`
              <div>
                <h3>${port.name}</h3>
                <p>Status: ${port.businessStatus}</p>
                <p>Rating: ${port.rating || 'N/A'}</p>
              </div>
            `);
            this.infoWindow.open(this.map, marker);
          }
        });
      });

      this.markers.push(marker);
    });
  }

  private updateMarkerForRoute(marker: google.maps.Marker, port: Port) {
    const selectedPorts = this.routeService.getSelectedPorts();
    const portIndex = selectedPorts.findIndex(p => 
      p.location.lat === port.location.lat && 
      p.location.lng === port.location.lng
    );

    if (portIndex === -1) {
      // Port is not selected
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    } else {
      // Port is selected
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
      if (portIndex === 0) {
        this.showStartingPortInfo(marker);
      }
    }

    this.showRemainingPortsInfo(selectedPorts.length);

    // If route is complete, hide unselected markers
    if (this.routeService.isRouteComplete()) {
      this.hideUnselectedMarkers();
    }
  }

  private hideUnselectedMarkers() {
    const selectedPorts = this.routeService.getSelectedPorts();
    this.markers.forEach(marker => {
      const markerPosition = marker.getPosition()?.toJSON();
      if (markerPosition) {
        const isSelected = selectedPorts.some(port => 
          port.location.lat === markerPosition.lat && 
          port.location.lng === markerPosition.lng
        );
        if (!isSelected) {
          marker.setMap(null);
        }
      }
    });
  }

  private showStartingPortInfo(marker: google.maps.Marker) {
    if (this.startingPortWindow) {
      this.startingPortWindow.close();
    }

    this.startingPortWindow = new google.maps.InfoWindow({
      content: 'Starting Port',
      position: marker.getPosition()
    });

    this.startingPortWindow.open(this.map);
  }

  private showRemainingPortsInfo(selectedCount: number) {
    if (this.remainingPortsWindow) {
      this.remainingPortsWindow.close();
    }

    const remaining = this.routeService.getPortsRemaining();
    if (remaining > 0) {
      this.remainingPortsWindow = new google.maps.InfoWindow({
        content: `${remaining} ports remaining to select`,
        position: this.map?.getCenter()
      });

      this.remainingPortsWindow.open(this.map);
      setTimeout(() => this.remainingPortsWindow?.close(), 3000);
    }
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.center = event.latLng.toJSON();
    }
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const pos = event.latLng.toJSON();
      console.log(pos);
    }
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  updateMarkerColor(port: Port, color: string) {
    const marker = this.markers.find(m =>
      m.getPosition()?.lat() === port.location.lat &&
      m.getPosition()?.lng() === port.location.lng
    );
    
    if (marker) {
      marker.setIcon(`http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`);
    }
  }
}