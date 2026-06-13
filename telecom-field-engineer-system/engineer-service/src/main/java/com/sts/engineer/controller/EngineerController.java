package com.sts.engineer.controller;

import com.sts.engineer.dto.BestMatchRequest;
import com.sts.engineer.entity.Engineer;
import com.sts.engineer.service.EngineerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Engineer Controller
 * 
 * REST API endpoints for engineer management.
 * 
 * Endpoints:
 * GET    /api/engineers              - List all engineers
 * GET    /api/engineers/{id}         - Get engineer by ID
 * POST   /api/engineers              - Create engineer
 * PUT    /api/engineers/{id}         - Update engineer
 * GET    /api/engineers/available    - Available engineers (not on holiday)
 * PUT    /api/engineers/{id}/workload - Update workload
 * PUT    /api/engineers/{id}/holiday  - Set holiday period
 * POST   /api/engineers/best-match   - Find best engineer for assignment (FR13)
 */
@RestController
@RequestMapping("/api/engineers")
@CrossOrigin(origins = "http://localhost:4200")
public class EngineerController {

    @Autowired
    private EngineerService engineerService;

    @GetMapping
    public ResponseEntity<List<Engineer>> getAllEngineers() {
        return ResponseEntity.ok(engineerService.getAllEngineers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEngineerById(@PathVariable Long id) {
        Optional<Engineer> engineer = engineerService.getEngineerById(id);
        if (engineer.isPresent()) {
            return ResponseEntity.ok(engineer.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Engineer not found!"));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getEngineerByEmail(@PathVariable String email) {
        Optional<Engineer> engineer = engineerService.getEngineerByEmail(email);
        if (engineer.isPresent()) {
            return ResponseEntity.ok(engineer.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Engineer not found!"));
    }

    @PostMapping
    public ResponseEntity<Engineer> createEngineer(@RequestBody Engineer engineer) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(engineerService.createEngineer(engineer));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEngineer(@PathVariable Long id, @RequestBody Engineer engineer) {
        Engineer updated = engineerService.updateEngineer(id, engineer);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Engineer not found!"));
    }

    @GetMapping("/available")
    public ResponseEntity<List<Engineer>> getAvailableEngineers() {
        return ResponseEntity.ok(engineerService.getAvailableEngineers());
    }

    @PutMapping("/{id}/workload")
    public ResponseEntity<?> updateWorkload(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Engineer updated = engineerService.updateWorkload(id, body.get("workload"));
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Engineer not found!"));
    }

    @PutMapping("/{id}/holiday")
    public ResponseEntity<?> setHoliday(@PathVariable Long id, @RequestBody Engineer holidayData) {
        Engineer updated = engineerService.setHoliday(id, holidayData);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Engineer not found!"));
    }

    /**
     * POST /api/engineers/best-match
     * Find the best engineer for a task assignment (FR13)
     * Considers: distance, workload, availability, holidays
     */
    @PostMapping("/best-match")
    public ResponseEntity<?> findBestMatch(@RequestBody BestMatchRequest request) {
        Engineer best = engineerService.findBestMatch(request);
        if (best != null) {
            return ResponseEntity.ok(best);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "No available engineers found!"));
    }
}
