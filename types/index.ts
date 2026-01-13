export type ThemeMode = 'light' | 'dark';

export type Locale = 'en' | 'ru' | 'hy';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'dispatcher' | 'viewer';
  avatar?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  type: string;
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  currentSpeed?: number;
  engineOn: boolean;
  location?: {
    lat: number;
    lng: number;
  };
  fuelLevel?: number;
  odometer: number;
}

export interface FuelEvent {
  id: string;
  vehicleId: string;
  type: 'fill' | 'drain';
  liters: number;
  timestamp: Date;
  location?: {
    lat: number;
    lng: number;
  };
  cost?: number;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'oil_change' | 'tire_rotation' | 'brake_service' | 'general';
  date: Date;
  odometer: number;
  nextServiceOdometer?: number;
  cost?: number;
  parts?: string;
  supplier?: string;
  notes?: string;
  receiptUrl?: string;
}

export interface Alert {
  id: string;
  type: 'geofence' | 'fuel' | 'maintenance' | 'insurance' | 'speeding';
  priority: 'low' | 'medium' | 'high' | 'critical';
  vehicleId?: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  snoozedUntil?: Date;
}

export interface Geofence {
  id: string;
  name: string;
  type: 'circle' | 'polygon';
  coordinates: { lat: number; lng: number }[];
  radius?: number;
  notifyOnEntry: boolean;
  notifyOnExit: boolean;
}

export interface Trip {
  id: string;
  vehicleId: string;
  startTime: Date;
  endTime?: Date;
  startLocation: { lat: number; lng: number };
  endLocation?: { lat: number; lng: number };
  distance: number;
  duration?: number;
  averageSpeed?: number;
  fuelConsumed?: number;
}
