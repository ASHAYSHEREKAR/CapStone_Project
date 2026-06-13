package com.sts.ticket.dto;

import lombok.*;

/**
 * Ticket Creation Request DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketRequest {
    private Long userId;
    private String userName;
    private String ticketType;    // INSTALLATION or FAULT
    private String description;
    private String location;
    private Double latitude;
    private Double longitude;
}
