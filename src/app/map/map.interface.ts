export interface MapSettings {
    center: google.maps.LatLngLiteral;
    zoom: number;
    mapTypeId: google.maps.MapTypeId;
  }
  
  export interface MapMarker {
    position: google.maps.LatLngLiteral;
    title: string;
    options?: google.maps.MarkerOptions;
  }