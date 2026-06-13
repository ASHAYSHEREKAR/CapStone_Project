package com.sts.auth.dto;

import lombok.*;

/**
 * Registration Request DTO
 * Used when a new user/admin/engineer registers (FR4)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;       // USER, ADMIN, ENGINEER
    private String phone;
    private String address;
    private String securityQuestion;
    private String securityAnswer;
}
