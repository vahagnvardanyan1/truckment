export type MapProvider = 'google' | 'yandex' | 'mapbox';

export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapMarker {
  id: string;
  position: MapCoordinates;
  icon?: string;
  title?: string;
  info?: any;
  onClick?: () => void;
}

export interface MapPolyline {
  id: string;
  path: MapCoordinates[];
  color?: string;
  width?: number;
}

export interface MapCircle {
  id: string;
  center: MapCoordinates;
  radius: number;
  fillColor?: string;
  strokeColor?: string;
}

export interface MapPolygon {
  id: string;
  path: MapCoordinates[];
  fillColor?: string;
  strokeColor?: string;
}

export interface IMapProvider {
  initialize: ({ containerId, center, zoom }: {
    containerId: string;
    center: MapCoordinates;
    zoom: number;
  }) => Promise<void>;

  destroy: () => void;

  setCenter: (center: MapCoordinates) => void;

  setZoom: (zoom: number) => void;

  fitBounds: (bounds: MapBounds) => void;

  addMarker: (marker: MapMarker) => void;

  removeMarker: (markerId: string) => void;

  updateMarker: ({ markerId, position }: {
    markerId: string;
    position: MapCoordinates;
  }) => void;

  addPolyline: (polyline: MapPolyline) => void;

  removePolyline: (polylineId: string) => void;

  addCircle: (circle: MapCircle) => void;

  removeCircle: (circleId: string) => void;

  addPolygon: (polygon: MapPolygon) => void;

  removePolygon: (polygonId: string) => void;

  clearAll: () => void;
}
