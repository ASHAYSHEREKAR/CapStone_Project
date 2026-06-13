package com.sts.ticket.dto;

import lombok.*;

/**
 * Status Update Request DTO
 * Used by engineers to update ticket status (FR18, FR18.1)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateRequest {
    private String status;       // ACCEPTED, REJECTED, IN_PROGRESS, SUCCESS, FAILURE, DEFERRED
    private String adminNotes;   // Optional notes (used for reassignment reasons)
}
