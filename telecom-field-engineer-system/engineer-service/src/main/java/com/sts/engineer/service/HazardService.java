package com.sts.engineer.service;

import com.sts.engineer.entity.Hazard;
import com.sts.engineer.repository.HazardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Hazard Service
 * 
 * Manages hazard and risk compliance data.
 * FR20: Engineers can CRUD hazards
 * FR21: Admins can CRUD hazards
 * NFR8: Real-time hazard retrieval
 */
@Service
public class HazardService {

    @Autowired
    private HazardRepository hazardRepository;

    /** Get all hazards */
    public List<Hazard> getAllHazards() {
        return hazardRepository.findAll();
    }

    /** Get hazard by ID */
    public Optional<Hazard> getHazardById(Long id) {
        return hazardRepository.findById(id);
    }

    /** Search hazards by location */
    public List<Hazard> getHazardsByLocation(String location) {
        return hazardRepository.findByLocationContainingIgnoreCase(location);
    }

    /** Get hazards by severity */
    public List<Hazard> getHazardsBySeverity(String severity) {
        return hazardRepository.findBySeverity(
                Hazard.Severity.valueOf(severity.toUpperCase()));
    }

    /** Get hazards reported by a specific engineer */
    public List<Hazard> getHazardsByEngineer(Long engineerId) {
        return hazardRepository.findByReportedBy(engineerId);
    }

    /** Add a new hazard */
    public Hazard addHazard(Hazard hazard) {
        return hazardRepository.save(hazard);
    }

    /** Update an existing hazard */
    public Hazard updateHazard(Long id, Hazard updated) {
        Optional<Hazard> existingOpt = hazardRepository.findById(id);
        if (existingOpt.isEmpty()) return null;

        Hazard existing = existingOpt.get();
        if (updated.getLocation() != null) existing.setLocation(updated.getLocation());
        if (updated.getLatitude() != null) existing.setLatitude(updated.getLatitude());
        if (updated.getLongitude() != null) existing.setLongitude(updated.getLongitude());
        if (updated.getHazardType() != null) existing.setHazardType(updated.getHazardType());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getSeverity() != null) existing.setSeverity(updated.getSeverity());

        return hazardRepository.save(existing);
    }

    /** Delete a hazard */
    public boolean deleteHazard(Long id) {
        if (hazardRepository.existsById(id)) {
            hazardRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
