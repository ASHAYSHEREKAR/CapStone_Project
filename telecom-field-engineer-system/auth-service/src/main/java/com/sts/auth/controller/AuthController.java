package com.sts.auth.controller;

import com.sts.auth.dto.*;
import com.sts.auth.entity.User;
import com.sts.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Authentication Controller
 * 
 * REST API endpoints for authentication and user management.
 * All endpoints are prefixed with /api/auth
 * 
 * Endpoints:
 * POST /api/auth/register      - Register a new user (FR4)
 * POST /api/auth/login          - Login (FR2, FR3)
 * GET  /api/auth/security-question?email=x  - Get security question (FR5)
 * POST /api/auth/forgot-password - Reset password (FR5)
 * GET  /api/auth/users          - Get all users (FR11)
 * GET  /api/auth/users/role/{role} - Get users by role (FR11)
 * GET  /api/auth/user/{id}      - Get user profile (FR8)
 * PUT  /api/auth/user/{id}      - Update user profile (FR8)
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/register
     * Register a new user, admin, or engineer (FR4)
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        String result = authService.register(request);
        if (result.contains("successful")) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", result));
        }
        return ResponseEntity.badRequest()
                .body(Map.of("message", result));
    }

    /**
     * POST /api/auth/login
     * Common login for all roles (FR2, FR3)
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        if (response.getMessage().contains("successful")) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    /**
     * GET /api/auth/security-question?email=user@example.com
     * Get the security question for password recovery (FR5 - Step 1)
     */
    @GetMapping("/security-question")
    public ResponseEntity<Map<String, String>> getSecurityQuestion(@RequestParam String email) {
        String question = authService.getSecurityQuestion(email);
        if (question.equals("User not found!")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", question));
        }
        return ResponseEntity.ok(Map.of("securityQuestion", question));
    }

    /**
     * POST /api/auth/forgot-password
     * Reset password using security answer (FR5 - Step 2)
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String result = authService.forgotPassword(request);
        if (result.contains("successfully")) {
            return ResponseEntity.ok(Map.of("message", result));
        }
        return ResponseEntity.badRequest()
                .body(Map.of("message", result));
    }

    /**
     * GET /api/auth/users
     * Get all users - for admin dashboard (FR11)
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    /**
     * GET /api/auth/users/role/{role}
     * Get users by role - for admin to view engineers/users (FR11)
     */
    @GetMapping("/users/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        return ResponseEntity.ok(authService.getUsersByRole(role));
    }

    /**
     * GET /api/auth/user/{id}
     * Get a specific user's profile (FR8)
     */
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> user = authService.getUserById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User not found!"));
    }

    /**
     * PUT /api/auth/user/{id}
     * Update user profile (FR8)
     */
    @PutMapping("/user/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody RegisterRequest request) {
        User updated = authService.updateProfile(id, request);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User not found!"));
    }
}
