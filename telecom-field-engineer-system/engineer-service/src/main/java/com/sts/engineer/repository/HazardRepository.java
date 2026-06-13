package com.sts.engineer.repository;

import com.sts.engineer.entity.Hazard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Hazard Repository
 */
@Repository
public interface HazardRepository extends JpaRepository<Hazard, Long> {

    /** Find hazards by location name (case-insensitive) */
    List<Hazard> findByLocationContainingIgnoreCase(String location);

    /** Find hazards by severity */
    List<Hazard> findBySeverity(Hazard.Severity severity);

    /** Find hazards reported by a specific engineer */
    List<Hazard> findByReportedBy(Long engineerId);
}
