package com.sts.ticket.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Ticket Entity
 * 
 * Represents a service request (installation or fault) raised by a user.
 * Maps to the 'tickets' table in sts_ticket_db.
 * 
 * Status Workflow:
 * OPEN → ASSIGNED (admin assigns engineer)
 *   → ACCEPTED / REJECTED (engineer responds)
 *   → IN_PROGRESS (engineer starts work)
 *   → SUCCESS / FAILURE / DEFERRED (engineer completes)
 *   DEFERRED → OPEN (admin reassigns - FR15)
 * 
 * FR6:  User raises ticket (INSTALLATION / FAULT)
 * FR12: Priority based on service type (FAULT > INSTALLATION)
 * FR18: Engineer accepts/rejects
 * FR18.1: After acceptance: SUCCESS, FAILURE, DEFERRED
 */
@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id")
    private Long ticketId;

    /** ID of the user who raised the ticket */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** ID of the assigned engineer (null if unassigned) */
    @Column(name = "engineer_id")
    private Long engineerId;

    /** Service type: INSTALLATION or FAULT */
    @Enumerated(EnumType.STRING)
    @Column(name = "ticket_type", nullable = false)
    private TicketType ticketType;

    /** Detailed description of the issue or request */
    @Column(nullable = false, length = 1000)
    private String description;

    /** Location area name (e.g., "Koramangala", "Whitefield") */
    @Column(nullable = false)
    private String location;

    /** GPS latitude for map integration */
    @Column
    private Double latitude;

    /** GPS longitude for map integration */
    @Column
    private Double longitude;

    /** Priority: AUTO-SET based on ticket type. FAULT→HIGH, INSTALLATION→MEDIUM */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    /** Current status in the workflow */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    /** Admin notes (e.g., reason for reassignment) */
    @Column(name = "admin_notes", length = 500)
    private String adminNotes;

    /** User's name (denormalized for display) */
    @Column(name = "user_name")
    private String userName;

    /** Engineer's name (denormalized for display) */
    @Column(name = "engineer_name")
    private String engineerName;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        // Auto-set priority based on ticket type (FR12)
        if (this.priority == null) {
            this.priority = (this.ticketType == TicketType.FAULT) ? Priority.HIGH : Priority.MEDIUM;
        }
        if (this.status == null) {
            this.status = Status.OPEN;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /** Ticket type enum */
    public enum TicketType {
        INSTALLATION, FAULT
    }

    /** Priority enum */
    public enum Priority {
        HIGH, MEDIUM, LOW
    }

    /** Status workflow enum */
    public enum Status {
        OPEN,        // Newly created, awaiting assignment
        ASSIGNED,    // Admin assigned an engineer
        ACCEPTED,    // Engineer accepted the task
        REJECTED,    // Engineer rejected the task
        IN_PROGRESS, // Engineer is working on it
        SUCCESS,     // Task completed successfully
        FAILURE,     // Task failed
        DEFERRED     // Task deferred, needs reassignment
    }
}
