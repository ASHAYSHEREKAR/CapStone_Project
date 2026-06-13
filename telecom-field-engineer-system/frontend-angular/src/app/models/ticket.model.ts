/**
 * Ticket model matching the backend Ticket entity
 */
export interface Ticket {
  ticketId?: number;
  userId: number;
  engineerId?: number;
  ticketType: 'INSTALLATION' | 'FAULT';
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'ASSIGNED' | 'ACCEPTED' | 'REJECTED' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE' | 'DEFERRED';
  adminNotes?: string;
  userName?: string;
  engineerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TicketRequest {
  userId: number;
  userName: string;
  ticketType: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
}

export interface StatusUpdateRequest {
  status: string;
  adminNotes?: string;
}

export interface AssignRequest {
  engineerId: number;
  engineerName: string;
}
