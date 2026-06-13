package com.sts.auth.dto;

import lombok.*;

/**
 * Login Response DTO
 * Returned after successful login with user details and role
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String message;
}
