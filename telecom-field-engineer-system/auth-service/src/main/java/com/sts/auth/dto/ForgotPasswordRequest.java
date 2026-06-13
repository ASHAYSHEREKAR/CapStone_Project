package com.sts.auth.dto;

import lombok.*;

/**
 * Forgot Password Request DTO
 * Used for password recovery via security question (FR5)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordRequest {
    private String email;
    private String securityAnswer;
    private String newPassword;
}
