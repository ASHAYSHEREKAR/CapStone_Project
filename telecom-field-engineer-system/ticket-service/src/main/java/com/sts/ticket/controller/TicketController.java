package com.sts.ticket.controller;

import com.sts.ticket.dto.*;
import com.sts.ticket.entity.Ticket;
import com.sts.ticket.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Ticket Controller
 * 
 * REST API endpoints for ticket management.
 * 
 * Endpoints:
 * POST /api/tickets                         - Create ticket (FR6)
 * GET  /api/tickets                         - All tickets (admin, FR11)
 * GET  /api/tickets/{id}                    - Get ticket by ID
 * GET  /api/tickets/user/{userId}           - User's tickets (FR7)
 * GET  /api/tickets/engineer/{engineerId}   - Engineer's tasks (FR16)
 * GET  /api/tickets/status/{status}         - By status
 * GET  /api/tickets/alerts                  - Failed/Deferred (FR14)
 * PUT  /api/tickets/{id}/assign             - Assign engineer (admin)
 * PUT  /api/tickets/{id}/status             - Update status (FR18)
 * PUT  /api/tickets/{id}/reassign           - Reassign deferred (FR15)
 * GET  /api/tickets/engineer/{id}/count     - Active ticket count
 */
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:4200")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    /**
     * POST /api/tickets - Create a new ticket (FR6)
     */
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody TicketRequest request) {
        Ticket ticket = ticketService.createTicket(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ticket);
    }

    /**
     * GET /api/tickets - Get all tickets (admin, FR11)
     */
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    /**
     * GET /api/tickets/{id} - Get ticket by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        Optional<Ticket> ticket = ticketService.getTicketById(id);
        if (ticket.isPresent()) {
            return ResponseEntity.ok(ticket.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Ticket not found!"));
    }

    /**
     * GET /api/tickets/user/{userId} - User's tickets (FR7)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Ticket>> getTicketsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ticketService.getTicketsByUserId(userId));
    }

    /**
     * GET /api/tickets/engineer/{engineerId} - Engineer's assigned tasks (FR16)
     */
    @GetMapping("/engineer/{engineerId}")
    public ResponseEntity<List<Ticket>> getTicketsByEngineerId(@PathVariable Long engineerId) {
        return ResponseEntity.ok(ticketService.getTicketsByEngineerId(engineerId));
    }

    /**
     * GET /api/tickets/status/{status} - Tickets by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Ticket>> getTicketsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(ticketService.getTicketsByStatus(status));
    }

    /**
     * GET /api/tickets/alerts - Failed/Deferred/Rejected tickets for admin (FR14)
     */
    @GetMapping("/alerts")
    public ResponseEntity<List<Ticket>> getAlertTickets() {
        return ResponseEntity.ok(ticketService.getAlertTickets());
    }

    /**
     * PUT /api/tickets/{id}/assign - Assign engineer to ticket (admin)
     */
    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignEngineer(@PathVariable Long id, @RequestBody AssignRequest request) {
        Ticket ticket = ticketService.assignEngineer(id, request);
        if (ticket != null) {
            return ResponseEntity.ok(ticket);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Ticket not found!"));
    }

    /**
     * PUT /api/tickets/{id}/status - Update ticket status (FR18, FR18.1)
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        Ticket ticket = ticketService.updateStatus(id, request);
        if (ticket != null) {
            return ResponseEntity.ok(ticket);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Ticket not found!"));
    }

    /**
     * PUT /api/tickets/{id}/reassign - Reassign deferred ticket (FR15)
     */
    @PutMapping("/{id}/reassign")
    public ResponseEntity<?> reassignTicket(@PathVariable Long id, @RequestBody AssignRequest request) {
        Ticket ticket = ticketService.reassignTicket(id, request);
        if (ticket != null) {
            return ResponseEntity.ok(ticket);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Ticket not found!"));
    }

    /**
     * GET /api/tickets/engineer/{id}/count - Active tickets count for workload
     */
    @GetMapping("/engineer/{id}/count")
    public ResponseEntity<Map<String, Long>> getActiveTicketCount(@PathVariable Long id) {
        long count = ticketService.getActiveTicketCount(id);
        return ResponseEntity.ok(Map.of("activeTickets", count));
    }
}
