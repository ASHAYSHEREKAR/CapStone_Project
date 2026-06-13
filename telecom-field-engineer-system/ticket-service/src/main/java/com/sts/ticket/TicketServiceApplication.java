package com.sts.ticket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Ticket Service Application
 * 
 * Handles ticket creation, assignment, status updates,
 * and ticket history for the STS system.
 * 
 * Runs on port 8082. Registers with Eureka.
 */
@SpringBootApplication
@EnableDiscoveryClient
public class TicketServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TicketServiceApplication.class, args);
    }
}
