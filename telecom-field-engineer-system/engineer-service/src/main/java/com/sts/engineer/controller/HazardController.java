package com.sts.engineer.controller;

import com.sts.engineer.entity.Hazard;
import com.sts.engineer.service.HazardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Hazard Controller
 * 
 * REST API endpoints for hazard and risk management.
 * Accessible by both Engineers (FR20) and Admins (FR21).
 * 
 * Endpoints:
 * GET    /api/hazards                       - List all hazards
 * GET    /api/hazards/{id}                  - Get hazard by ID
 * GET    /api/hazards/location/{location}   - Search by location
 * GET    /api/hazards/severity/{severity}   - Filter by severity
 * GET    /api/hazards/engineer/{engineerId} - Hazards by reporter
 * POST   /api/hazards                       - Add new hazard
 * PUT    /api/hazards/{id}                  - Update hazard
 * DELETE /api/hazards/{id}                  - Delete hazard
 */
@RestController
@RequestMapping("/api/hazards")
@CrossOrigin(origins = "http://localhost:4200")
public class HazardController {

    @Autowired
    private HazardService hazardService;

    @GetMapping
    public ResponseEntity<List<Hazard>> getAllHazards() {
        return ResponseEntity.ok(hazardService.getAllHazards());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHazardById(@PathVariable Long id) {
        Optional<Hazard> hazard = hazardService.getHazardById(id);
        if (hazard.isPresent()) {
            return ResponseEntity.ok(hazard.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Hazard not found!"));
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<List<Hazard>> getHazardsByLocation(@PathVariable String location) {
        return ResponseEntity.ok(hazardService.getHazardsByLocation(location));
    }

    @GetMapping("/severity/{severity}")
    public ResponseEntity<List<Hazard>> getHazardsBySeverity(@PathVariable String severity) {
        return ResponseEntity.ok(hazardService.getHazardsBySeverity(severity));
    }

    @GetMapping("/engineer/{engineerId}")
    public ResponseEntity<List<Hazard>> getHazardsByEngineer(@PathVariable Long engineerId) {
        return ResponseEntity.ok(hazardService.getHazardsByEngineer(engineerId));
    }

    @PostMapping
    public ResponseEntity<Hazard> addHazard(@RequestBody Hazard hazard) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(hazardService.addHazard(hazard));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHazard(@PathVariable Long id, @RequestBody Hazard hazard) {
        Hazard updated = hazardService.updateHazard(id, hazard);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Hazard not found!"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHazard(@PathVariable Long id) {
        if (hazardService.deleteHazard(id)) {
            return ResponseEntity.ok(Map.of("message", "Hazard deleted successfully!"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Hazard not found!"));
    }
}
