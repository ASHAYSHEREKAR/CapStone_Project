package com.sts.ticket.dto;

import lombok.*;

/**
 * Assign Engineer Request DTO
 * Used by admin to assign/reassign an engineer to a ticket
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssignRequest {
    private Long engineerId;
    private String engineerName;
}
