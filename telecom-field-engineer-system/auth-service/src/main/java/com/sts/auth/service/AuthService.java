package com.sts.auth.service;

import com.sts.auth.dto.*;
import com.sts.auth.entity.User;
import com.sts.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Authentication Service
 * 
 * Handles all business logic for user authentication and management.
 * 
 * FR1: Supports USER, ADMIN, ENGINEER roles
 * FR2/FR3: Common login with role-based response
 * FR4: Role-specific registration
 * FR5: Security question-based password recovery
 * FR8: Profile viewing and updating
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Register a new user
     * FR4: Users, Engineers, and Admins provide specific information for registration.
     * 
     * @param request registration details
     * @return success/failure message
     */
    public String register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already registered!";
        }

        // Build user entity from request
        // Password is received already encrypted from frontend (Encrypt-js)
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(User.Role.valueOf(request.getRole().toUpperCase()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .securityQuestion(request.getSecurityQuestion())
                .securityAnswer(request.getSecurityAnswer())
                .build();

        userRepository.save(user);
        return "Registration successful!";
    }

    /**
     * Authenticate a user
     * FR2: Common login page for users, engineers and admins.
     * FR3: Users authenticate before accessing ticket-raising functionality.
     * 
     * @param request login credentials (email + encrypted password)
     * @return LoginResponse with user details or error
     */
    public LoginResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return LoginResponse.builder()
                    .message("User not found!")
                    .build();
        }

        User user = userOpt.get();

        // Compare encrypted passwords (both encrypted with Encrypt-js on frontend)
        if (!user.getPassword().equals(request.getPassword())) {
            return LoginResponse.builder()
                    .message("Invalid credentials!")
                    .build();
        }

        return LoginResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("Login successful!")
                .build();
    }

    /**
     * Forgot Password - Security Question Flow
     * FR5: Feature of security questions in case the user forgets login credentials.
     * 
     * Step 1: User provides email → system returns the security question
     * Step 2: User provides answer + new password → system verifies and updates
     * 
     * @param request forgot password details
     * @return success/failure message
     */
    public String forgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return "User not found with this email!";
        }

        User user = userOpt.get();

        // Verify security answer (case-insensitive comparison)
        if (!user.getSecurityAnswer().equalsIgnoreCase(request.getSecurityAnswer())) {
            return "Incorrect security answer!";
        }

        // Update password (already encrypted from frontend)
        user.setPassword(request.getNewPassword());
        userRepository.save(user);

        return "Password updated successfully!";
    }

    /**
     * Get security question for a user (first step of forgot password)
     * 
     * @param email the user's email
     * @return the security question or error message
     */
    public String getSecurityQuestion(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return "User not found!";
        }
        return userOpt.get().getSecurityQuestion();
    }

    /**
     * Get all users (FR11: Admin views user details)
     * 
     * @return list of all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Get users by role (FR11: Admin views technician details)
     * 
     * @param role the role to filter by
     * @return list of users with that role
     */
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(User.Role.valueOf(role.toUpperCase()));
    }

    /**
     * Get user by ID
     * 
     * @param id the user ID
     * @return Optional containing the user
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Update user profile (FR8)
     * 
     * @param id the user ID
     * @param request updated profile details
     * @return updated user or null if not found
     */
    public User updateProfile(Long id, RegisterRequest request) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return null;
        }

        User user = userOpt.get();
        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(request.getPassword());
        }

        return userRepository.save(user);
    }
}
