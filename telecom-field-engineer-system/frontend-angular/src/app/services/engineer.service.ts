import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Engineer, Hazard, BestMatchRequest } from '../models/engineer.model';

// ----------------------------------------------------
// VIVA EXPLANATION: What is EngineerService?
// - Purpose: Communicates with the Engineer and Hazard Microservice.
// - URL: Hits the backend running on http://localhost:8083/api/engineers (and /api/hazards).
// - Responsibility: Manages engineer profiles, leave schedules, engineer routing matches, and hazards reporting.
// ----------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class EngineerService {

  private baseUrl = 'http://localhost:8083/api/engineers';
  private hazardUrl = 'http://localhost:8083/api/hazards';

  constructor(private http: HttpClient) {}

  // ---- Engineer Endpoints ----

  // VIVA EXPLANATION: Fetches all engineers list (used in Admin dashboard for selection).
  getAllEngineers(): Observable<Engineer[]> {
    return this.http.get<Engineer[]>(this.baseUrl);
  }

  // VIVA EXPLANATION: Registers a new engineer profile in the engineer microservice database.
  createEngineer(engineer: Engineer): Observable<Engineer> {
    return this.http.post<Engineer>(this.baseUrl, engineer);
  }

  // VIVA EXPLANATION: Fetches details of a single engineer by ID.
  getEngineerById(id: number): Observable<Engineer> {
    return this.http.get<Engineer>(`${this.baseUrl}/${id}`);
  }

  // VIVA EXPLANATION: Updates engineer profile attributes (such as availability status).
  updateEngineer(id: number, engineer: any): Observable<Engineer> {
    return this.http.put<Engineer>(`${this.baseUrl}/${id}`, engineer);
  }

  // VIVA EXPLANATION: Finds engineer details by email address (used during engineer dashboard login).
  getEngineerByEmail(email: string): Observable<Engineer> {
    return this.http.get<Engineer>(`${this.baseUrl}/email/${email}`);
  }

  // VIVA EXPLANATION: Fetches all engineers who are currently set to available.
  getAvailableEngineers(): Observable<Engineer[]> {
    return this.http.get<Engineer[]>(`${this.baseUrl}/available`);
  }

  // VIVA EXPLANATION: Calls the backend matching algorithm (based on proximity, workload, and specialization) to return the recommended engineer for a task.
  findBestMatch(request: BestMatchRequest): Observable<Engineer> {
    return this.http.post<Engineer>(`${this.baseUrl}/best-match`, request);
  }

  // VIVA EXPLANATION: Increments or decrements engineer's current active task workload.
  updateWorkload(id: number, workload: number): Observable<Engineer> {
    return this.http.put<Engineer>(`${this.baseUrl}/${id}/workload`, { workload });
  }

  // VIVA EXPLANATION: Sets start/end holiday dates for leave planning.
  setHoliday(id: number, holidayData: any): Observable<Engineer> {
    return this.http.put<Engineer>(`${this.baseUrl}/${id}/holiday`, holidayData);
  }

  // ---- Hazard Endpoints ----

  // VIVA EXPLANATION: Fetches all reported hazards to display on the system map and logs.
  getAllHazards(): Observable<Hazard[]> {
    return this.http.get<Hazard[]>(this.hazardUrl);
  }

  // VIVA EXPLANATION: Fetches hazards reported at a specific location.
  getHazardsByLocation(location: string): Observable<Hazard[]> {
    return this.http.get<Hazard[]>(`${this.hazardUrl}/location/${location}`);
  }

  // VIVA EXPLANATION: Creates a new hazard report (reported by engineer or admin) in the database.
  addHazard(hazard: Hazard): Observable<Hazard> {
    return this.http.post<Hazard>(this.hazardUrl, hazard);
  }

  // VIVA EXPLANATION: Updates details of an existing hazard.
  updateHazard(id: number, hazard: Hazard): Observable<Hazard> {
    return this.http.put<Hazard>(`${this.hazardUrl}/${id}`, hazard);
  }

  // VIVA EXPLANATION: Deletes a hazard report from the system.
  deleteHazard(id: number): Observable<any> {
    return this.http.delete(`${this.hazardUrl}/${id}`);
  }
}
