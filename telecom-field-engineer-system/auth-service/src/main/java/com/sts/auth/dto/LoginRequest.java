package com.sts.auth.dto;

import lombok.*;

/**
 * Login Request DTO
 * Used when a user/admin/engineer logs in (FR2, FR3)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
}
