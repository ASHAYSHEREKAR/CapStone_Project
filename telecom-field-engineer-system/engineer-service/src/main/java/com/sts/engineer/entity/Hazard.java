package com.sts.engineer.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Hazard Entity
 * 
 * Represents a hazard or risk at a work site.
 * Integrates with Hazard and Risk Compliance as per spec.
 * 
 * FR20: Engineers can view, add, update, delete hazards
 * FR21: Admins can view, add, update, delete hazards
 * NFR8: Real-time retrieval of hazard information for engineers
 */
@Entity
@Table(name = "hazards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hazard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hazard_id")
    private Long hazardId;

    /** Location area name */
    @Column(nullable = false)
    private String location;

    /** GPS coordinates for map display */
    @Column
    private Double latitude;

    @Column
    private Double longitude;

    /** Type of hazard: Electrical, Structural, Environmental, Chemical */
    @Column(name = "hazard_type", nullable = false)
    private String hazardType;

    /** Detailed description of the hazard */
    @Column(nullable = false, length = 1000)
    private String description;

    /** Severity level */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    /** ID of the engineer who reported this hazard */
    @Column(name = "reported_by")
    private Long reportedBy;

    /** Name of reporter (denormalized) */
    @Column(name = "reporter_name")
    private String reporterName;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /** Hazard severity levels */
    public enum Severity {
        LOW, MEDIUM, HIGH, CRITICAL
    }
}
