/**
 * Engineer model matching the backend Engineer entity
 */
export interface Engineer {
  engineerId?: number;
  name: string;
  email: string;
  password?: string;
  specialization?: string;
  homeLocation?: string;
  homeLatitude?: number;
  homeLongitude?: number;
  workload: number;
  holidayStart?: string;
  holidayEnd?: string;
  isAvailable: boolean;
  createdAt?: string;
}

/**
 * Hazard model matching the backend Hazard entity
 */
export interface Hazard {
  hazardId?: number;
  location: string;
  latitude?: number;
  longitude?: number;
  hazardType: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reportedBy?: number;
  reporterName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BestMatchRequest {
  faultLatitude: number;
  faultLongitude: number;
  serviceType: string;
}
