package com.sts.engineer.dto;

import lombok.*;

/**
 * Best Match Request DTO
 * Used by admin to find the best engineer for a ticket assignment.
 * The algorithm considers location, workload, and availability.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BestMatchRequest {
    private Double faultLatitude;
    private Double faultLongitude;
    private String serviceType;    // INSTALLATION or FAULT
}
