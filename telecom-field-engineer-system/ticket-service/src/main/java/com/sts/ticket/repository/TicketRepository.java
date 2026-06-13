package com.sts.ticket.repository;

import com.sts.ticket.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Ticket Repository
 * 
 * Provides database access for Ticket entities.
 */
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    /** Find all tickets raised by a specific user (FR7) */
    List<Ticket> findByUserIdOrderByCreatedAtDesc(Long userId);

    /** Find all tickets assigned to a specific engineer (FR16) */
    List<Ticket> findByEngineerIdOrderByCreatedAtDesc(Long engineerId);

    /** Find tickets by status (FR14: admin views FAILURE/DEFERRED tickets) */
    List<Ticket> findByStatus(Ticket.Status status);

    /** Find tickets by multiple statuses */
    List<Ticket> findByStatusIn(List<Ticket.Status> statuses);

    /** Find tickets by type and status */
    List<Ticket> findByTicketTypeAndStatus(Ticket.TicketType type, Ticket.Status status);

    /** Count tickets assigned to an engineer (for workload calculation) */
    long countByEngineerIdAndStatusIn(Long engineerId, List<Ticket.Status> statuses);
}
