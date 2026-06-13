package com.sts.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Authentication Service Application
 * 
 * Handles user registration, login, password recovery,
 * and profile management for the STS Field Engineer system.
 * 
 * Registers with Eureka Server for service discovery.
 * Runs on port 8081.
 */
@SpringBootApplication
@EnableDiscoveryClient
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }
}
