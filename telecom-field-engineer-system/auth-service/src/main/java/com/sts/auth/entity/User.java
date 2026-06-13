package com.sts.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * User Entity
 * 
 * Represents all system users including regular Users, Admins, and Engineers.
 * Maps to the 'users' table in the sts_auth_db database.
 * 
 * FR1: Roles include User, Engineer, and Admin.
 * FR4: Users, Engineers, and Admins provide specific information for registration.
 * FR5: Feature of security questions for password recovery.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    /**
     * Role determines dashboard access:
     * USER - can raise tickets, view history
     * ADMIN - can manage tickets, assign engineers, manage hazards
     * ENGINEER - can accept/reject tasks, update status, manage hazards
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;

    /**
     * Security question for password recovery (FR5)
     * Examples: "What is your pet's name?", "What city were you born in?"
     */
    @Column(name = "security_question")
    private String securityQuestion;

    /**
     * Answer to the security question (FR5)
     * Used to verify identity during password recovery
     */
    @Column(name = "security_answer")
    private String securityAnswer;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Automatically set timestamps on creation and update
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * User roles enum
     */
    public enum Role {
        USER, ADMIN, ENGINEER
    }
}
