package com.sts.engineer.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Engineer Entity
 * 
 * Represents a field engineer in the STS system.
 * Stores location (for distance calculation), workload, and holiday information.
 * 
 * FR13: Assignment considers distance, holidays, workload
 * FR19: Engineer availability based on workload and holidays
 */
@Entity
@Table(name = "engineers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Engineer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "engineer_id")
    private Long engineerId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    /** Specialization: Fiber, Copper, Installation, General */
    @Column
    private String specialization;

    /** Home location area name (e.g., "Koramangala") */
    @Column(name = "home_location")
    private String homeLocation;

    /** GPS coordinates for distance calculation */
    @Column(name = "home_latitude")
    private Double homeLatitude;

    @Column(name = "home_longitude")
    private Double homeLongitude;

    /** Current number of active tasks */
    @Column(nullable = false)
    @Builder.Default
    private Integer workload = 0;

    /** Holiday period start date */
    @Column(name = "holiday_start")
    private LocalDate holidayStart;

    /** Holiday period end date */
    @Column(name = "holiday_end")
    private LocalDate holidayEnd;

    /** Whether the engineer is currently available for new tasks */
    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /**
     * Check if engineer is currently on holiday
     */
    public boolean isOnHoliday() {
        if (holidayStart == null || holidayEnd == null) {
            return false;
        }
        LocalDate today = LocalDate.now();
        return !today.isBefore(holidayStart) && !today.isAfter(holidayEnd);
    }
}
