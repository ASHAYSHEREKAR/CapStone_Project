package com.sts.ticket.service;

import com.sts.ticket.dto.*;
import com.sts.ticket.entity.Ticket;
import com.sts.ticket.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * Ticket Service
 * 
 * Business logic for ticket lifecycle management.
 * 
 * FR6:    Create ticket (Installation/Fault)
 * FR7:    View user's tickets (current + history)
 * FR12:   Auto-prioritize by service type (FAULT=HIGH)
 * FR14:   Alert admin for FAILURE/DEFERRED tickets
 * FR15:   Reassign deferred tickets
 * FR16:   Engineer views assigned tickets
 * FR18:   Engineer accepts/rejects
 * FR18.1: After acceptance → SUCCESS/FAILURE/DEFERRED
 */
@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    /**
     * Create a new ticket (FR6)
     * Priority auto-set: FAULT→HIGH, INSTALLATION→MEDIUM
     */
    public Ticket createTicket(TicketRequest request) {
        Ticket ticket = Ticket.builder()
                .userId(request.getUserId())
                .userName(request.getUserName())
                .ticketType(Ticket.TicketType.valueOf(request.getTicketType().toUpperCase()))
                .description(request.getDescription())
                .location(request.getLocation())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(Ticket.Status.OPEN)
                .build();

        // Priority auto-set in @PrePersist
        return ticketRepository.save(ticket);
    }

    /**
     * Get all tickets (admin view - FR11)
     */
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    /**
     * Get tickets by user ID (FR7)
     */
    public List<Ticket> getTicketsByUserId(Long userId) {
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Get tickets assigned to an engineer (FR16)
     */
    public List<Ticket> getTicketsByEngineerId(Long engineerId) {
        return ticketRepository.findByEngineerIdOrderByCreatedAtDesc(engineerId);
    }

    /**
     * Get tickets by status (FR14: admin sees FAILURE/DEFERRED)
     */
    public List<Ticket> getTicketsByStatus(String status) {
        return ticketRepository.findByStatus(
                Ticket.Status.valueOf(status.toUpperCase()));
    }

    /**
     * Get failed and deferred tickets for admin alerts (FR14)
     */
    public List<Ticket> getAlertTickets() {
        return ticketRepository.findByStatusIn(
                Arrays.asList(Ticket.Status.FAILURE, Ticket.Status.DEFERRED, Ticket.Status.REJECTED));
    }

    /**
     * Get a ticket by ID
     */
    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    /**
     * Assign an engineer to a ticket (admin action)
     */
    public Ticket assignEngineer(Long ticketId, AssignRequest request) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
        if (ticketOpt.isEmpty()) {
            return null;
        }

        Ticket ticket = ticketOpt.get();
        ticket.setEngineerId(request.getEngineerId());
        ticket.setEngineerName(request.getEngineerName());
        ticket.setStatus(Ticket.Status.ASSIGNED);

        return ticketRepository.save(ticket);
    }

    /**
     * Update ticket status (FR18, FR18.1)
     * 
     * Valid transitions:
     * ASSIGNED → ACCEPTED, REJECTED
     * ACCEPTED → IN_PROGRESS
     * IN_PROGRESS → SUCCESS, FAILURE, DEFERRED
     */
    public Ticket updateStatus(Long ticketId, StatusUpdateRequest request) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
        if (ticketOpt.isEmpty()) {
            return null;
        }

        Ticket ticket = ticketOpt.get();
        Ticket.Status newStatus = Ticket.Status.valueOf(request.getStatus().toUpperCase());

        // Set the new status
        ticket.setStatus(newStatus);

        // If admin provides notes (e.g., reassignment reason)
        if (request.getAdminNotes() != null) {
            ticket.setAdminNotes(request.getAdminNotes());
        }

        // If rejected, remove engineer assignment
        if (newStatus == Ticket.Status.REJECTED) {
            ticket.setEngineerId(null);
            ticket.setEngineerName(null);
            ticket.setStatus(Ticket.Status.OPEN);
        }

        return ticketRepository.save(ticket);
    }

    /**
     * Reassign a deferred ticket (FR15)
     * Sets ticket back to OPEN and assigns new engineer
     */
    public Ticket reassignTicket(Long ticketId, AssignRequest request) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
        if (ticketOpt.isEmpty()) {
            return null;
        }

        Ticket ticket = ticketOpt.get();
        ticket.setEngineerId(request.getEngineerId());
        ticket.setEngineerName(request.getEngineerName());
        ticket.setStatus(Ticket.Status.ASSIGNED);
        ticket.setAdminNotes("Reassigned from previous engineer");

        return ticketRepository.save(ticket);
    }

    /**
     * Get active ticket count for an engineer (workload)
     */
    public long getActiveTicketCount(Long engineerId) {
        return ticketRepository.countByEngineerIdAndStatusIn(
                engineerId,
                Arrays.asList(Ticket.Status.ASSIGNED, Ticket.Status.ACCEPTED, Ticket.Status.IN_PROGRESS));
    }
}
