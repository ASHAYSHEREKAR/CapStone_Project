import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Engineer, Hazard, BestMatchRequest } from '../models/engineer.model';

/**
 * Engineer Service
 * Communicates with the Engineer Service backend (port 8083)
 */
@Injectable({
  providedIn: 'root'
})
export class EngineerService {

  private baseUrl = 'http://localhost:8083/api/engineers';
  private hazardUrl = 'http://localhost:8083/api/hazards';

  constructor(private http: HttpClient) {}

  // ---- Engineer endpoints ----
  getAllEngineers(): Observable<Engineer[]> {
    return this.http.get<Engineer[]>(this.baseUrl);
  }

  createEngineer(engineer: Engineer): Observable<Engineer> {
    return this.http.post<Engineer>(this.baseUrl, engineer);
  }

  getEngineerById(id: number): Observable<Engineer> {
    return this.http.get<Engineer>(`${this.baseUrl}/${id}`);
  }

  updateEngineer(id: number, engineer: any): Observable<Engineer> {
    return this.http.put<Engineer>(`${this.baseUrl}/${id}`, engineer);
  }

  getEngineerByEmail(email: string): Observable<Engineer> {
    return this.http.get<Engineer>(`${this.baseUrl}/email/${email}`);
  }

  getAvailableEngineers(): Observable<Engineer[]> {
    return this.http.get<Engineer[]>(`${this.baseUrl}/available`);
  }

  findBestMatch(request: BestMatchRequest): Observable<Engineer> {
    return this.http.post<Engineer>(`${this.baseUrl}/best-match`, request);
  }

  updateWorkload(id: number, workload: number): Observable<Engineer> {
    return this.http.put<Engineer>(`${this.baseUrl}/${id}/workload`, { workload });
  }

  setHoliday(id: number, holidayData: any): Observable<Engineer> {
    return this.http.put<Engineer>(`${this.baseUrl}/${id}/holiday`, holidayData);
  }

  // ---- Hazard endpoints ----
  getAllHazards(): Observable<Hazard[]> {
    return this.http.get<Hazard[]>(this.hazardUrl);
  }

  getHazardsByLocation(location: string): Observable<Hazard[]> {
    return this.http.get<Hazard[]>(`${this.hazardUrl}/location/${location}`);
  }

  addHazard(hazard: Hazard): Observable<Hazard> {
    return this.http.post<Hazard>(this.hazardUrl, hazard);
  }

  updateHazard(id: number, hazard: Hazard): Observable<Hazard> {
    return this.http.put<Hazard>(`${this.hazardUrl}/${id}`, hazard);
  }

  deleteHazard(id: number): Observable<any> {
    return this.http.delete(`${this.hazardUrl}/${id}`);
  }
}
