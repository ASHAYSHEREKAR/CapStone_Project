import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, TicketRequest, StatusUpdateRequest, AssignRequest } from '../models/ticket.model';

/**
 * Ticket Service
 * Communicates with the Ticket Service backend (port 8082)
 */
@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private baseUrl = 'http://localhost:8082/api/tickets';

  constructor(private http: HttpClient) {}

  createTicket(request: TicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(this.baseUrl, request);
  }

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.baseUrl);
  }

  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.baseUrl}/${id}`);
  }

  getTicketsByUserId(userId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/user/${userId}`);
  }

  getTicketsByEngineerId(engineerId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/engineer/${engineerId}`);
  }

  getTicketsByStatus(status: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/status/${status}`);
  }

  getAlertTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/alerts`);
  }

  assignEngineer(ticketId: number, request: AssignRequest): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.baseUrl}/${ticketId}/assign`, request);
  }

  updateStatus(ticketId: number, request: StatusUpdateRequest): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.baseUrl}/${ticketId}/status`, request);
  }

  reassignTicket(ticketId: number, request: AssignRequest): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.baseUrl}/${ticketId}/reassign`, request);
  }
}
