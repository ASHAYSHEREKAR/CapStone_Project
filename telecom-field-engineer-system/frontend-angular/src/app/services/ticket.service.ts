import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, TicketRequest, StatusUpdateRequest, AssignRequest } from '../models/ticket.model';

// ----------------------------------------------------
// VIVA EXPLANATION: What is TicketService?
// - Purpose: Communicates with the Ticket Microservice.
// - URL: Hits the backend running on http://localhost:8082/api/tickets.
// - Responsibility: Handles creating tickets, getting tickets for users/engineers, and updating ticket status/assignments.
// ----------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private baseUrl = 'http://localhost:8082/api/tickets';

  constructor(private http: HttpClient) {}

  // VIVA EXPLANATION: Creates a new support ticket (FAULT or INSTALLATION) requested by a user.
  createTicket(request: TicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(this.baseUrl, request);
  }

  // VIVA EXPLANATION: Retrieves all tickets from the system database (used by Admin).
  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.baseUrl);
  }

  // VIVA EXPLANATION: Fetches detail of a single ticket by its ID.
  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.baseUrl}/${id}`);
  }

  // VIVA EXPLANATION: Retrieves list of tickets raised by a specific Customer/User ID.
  getTicketsByUserId(userId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/user/${userId}`);
  }

  // VIVA EXPLANATION: Retrieves list of tickets assigned to a specific Field Engineer ID.
  getTicketsByEngineerId(engineerId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/engineer/${engineerId}`);
  }

  // VIVA EXPLANATION: Fetches tickets filtered by status (e.g. OPEN, ASSIGNED, SUCCESS).
  getTicketsByStatus(status: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/status/${status}`);
  }

  // VIVA EXPLANATION: Fetches tickets that need attention (like FAILED or DEFERRED).
  getAlertTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/alerts`);
  }

  // VIVA EXPLANATION: Assigns a ticket to a field engineer (called by Admin).
  assignEngineer(ticketId: number, request: AssignRequest): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.baseUrl}/${ticketId}/assign`, request);
  }

  // VIVA EXPLANATION: Updates status of a ticket (e.g. engineer accepts, rejects, starts, or completes task).
  updateStatus(ticketId: number, request: StatusUpdateRequest): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.baseUrl}/${ticketId}/status`, request);
  }

  // VIVA EXPLANATION: Reassigns a deferred/failed ticket to another engineer.
  reassignTicket(ticketId: number, request: AssignRequest): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.baseUrl}/${ticketId}/reassign`, request);
  }
}
