package com.sts.engineer.service;

import com.sts.engineer.dto.BestMatchRequest;
import com.sts.engineer.entity.Engineer;
import com.sts.engineer.repository.EngineerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Engineer Service
 * 
 * Manages engineer profiles, availability, workload,
 * and the smart assignment algorithm.
 * 
 * FR13: Assignment based on distance, holidays, workload
 * FR19: Engineer availability based on workload and holidays
 */
@Service
public class EngineerService {

    @Autowired
    private EngineerRepository engineerRepository;

    /** Get all engineers */
    public List<Engineer> getAllEngineers() {
        return engineerRepository.findAll();
    }

    /** Get engineer by ID */
    public Optional<Engineer> getEngineerById(Long id) {
        return engineerRepository.findById(id);
    }

    /** Get engineer by email */
    public Optional<Engineer> getEngineerByEmail(String email) {
        return engineerRepository.findByEmail(email);
    }

    /** Create a new engineer */
    public Engineer createEngineer(Engineer engineer) {
        return engineerRepository.save(engineer);
    }

    /** Update engineer profile */
    public Engineer updateEngineer(Long id, Engineer updated) {
        Optional<Engineer> existingOpt = engineerRepository.findById(id);
        if (existingOpt.isEmpty()) return null;

        Engineer existing = existingOpt.get();
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getSpecialization() != null) existing.setSpecialization(updated.getSpecialization());
        if (updated.getHomeLocation() != null) existing.setHomeLocation(updated.getHomeLocation());
        if (updated.getHomeLatitude() != null) existing.setHomeLatitude(updated.getHomeLatitude());
        if (updated.getHomeLongitude() != null) existing.setHomeLongitude(updated.getHomeLongitude());
        if (updated.getIsAvailable() != null) existing.setIsAvailable(updated.getIsAvailable());

        return engineerRepository.save(existing);
    }

    /**
     * Get available engineers
     * Filters out engineers who are on holiday or marked unavailable
     */
    public List<Engineer> getAvailableEngineers() {
        return engineerRepository.findAll().stream()
                .filter(e -> e.getIsAvailable() && !e.isOnHoliday())
                .collect(Collectors.toList());
    }

    /** Update engineer workload */
    public Engineer updateWorkload(Long id, int workload) {
        Optional<Engineer> engineerOpt = engineerRepository.findById(id);
        if (engineerOpt.isEmpty()) return null;

        Engineer engineer = engineerOpt.get();
        engineer.setWorkload(workload);
        return engineerRepository.save(engineer);
    }

    /** Set engineer holiday period */
    public Engineer setHoliday(Long id, Engineer holidayData) {
        Optional<Engineer> engineerOpt = engineerRepository.findById(id);
        if (engineerOpt.isEmpty()) return null;

        Engineer engineer = engineerOpt.get();
        engineer.setHolidayStart(holidayData.getHolidayStart());
        engineer.setHolidayEnd(holidayData.getHolidayEnd());
        return engineerRepository.save(engineer);
    }

    /**
     * Best Match Algorithm (FR13)
     * 
     * Finds the best engineer for a task based on:
     * 1. Availability (not on holiday, is_available = true)
     * 2. Workload (fewer active tasks = better)
     * 3. Distance from fault location (closer = better)
     * 
     * Score = (workload_weight * workload) + (distance_weight * distance_km)
     * Lower score = better match
     * 
     * FAULT tickets get priority (handled by ticket service setting priority)
     * 
     * @param request contains fault location coordinates and service type
     * @return the best matching engineer, or null if none available
     */
    public Engineer findBestMatch(BestMatchRequest request) {
        List<Engineer> available = getAvailableEngineers();

        if (available.isEmpty()) {
            return null;
        }

        // Weights for scoring
        final double WORKLOAD_WEIGHT = 5.0;   // Each task adds 5 to score
        final double DISTANCE_WEIGHT = 1.0;   // Each km adds 1 to score

        return available.stream()
                .min(Comparator.comparingDouble(engineer -> {
                    double distance = calculateDistance(
                            engineer.getHomeLatitude(),
                            engineer.getHomeLongitude(),
                            request.getFaultLatitude(),
                            request.getFaultLongitude()
                    );
                    return (WORKLOAD_WEIGHT * engineer.getWorkload())
                            + (DISTANCE_WEIGHT * distance);
                }))
                .orElse(null);
    }

    /**
     * Haversine Formula
     * 
     * Calculates the distance in kilometers between two GPS coordinates.
     * Used to determine how far an engineer is from a fault location.
     * This is what the Leaflet API visualizes on the map.
     * 
     * @param lat1 Engineer's home latitude
     * @param lon1 Engineer's home longitude
     * @param lat2 Fault location latitude
     * @param lon2 Fault location longitude
     * @return distance in kilometers
     */
    public double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
            return 999.0; // Large default if coordinates missing
        }

        final double EARTH_RADIUS_KM = 6371.0;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }
}
