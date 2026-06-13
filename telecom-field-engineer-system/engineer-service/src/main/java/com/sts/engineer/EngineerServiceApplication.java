package com.sts.engineer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Engineer Service Application
 * 
 * Manages engineer profiles, workload, holidays,
 * hazard information, and the assignment algorithm.
 * 
 * Runs on port 8083. Registers with Eureka.
 */
@SpringBootApplication
@EnableDiscoveryClient
public class EngineerServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(EngineerServiceApplication.class, args);
    }
}
