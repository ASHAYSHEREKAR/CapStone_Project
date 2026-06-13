-- ============================================
-- STS Field Engineer Task Management System
-- Database Schema
-- ============================================

-- Create databases
CREATE DATABASE IF NOT EXISTS sts_auth_db;
CREATE DATABASE IF NOT EXISTS sts_ticket_db;
CREATE DATABASE IF NOT EXISTS sts_engineer_db;

-- ============================================
-- AUTH DATABASE - Users Table
-- ============================================
USE sts_auth_db;

CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN', 'ENGINEER') NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    security_question VARCHAR(255),
    security_answer VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- ============================================
-- TICKET DATABASE - Tickets Table
-- ============================================
USE sts_ticket_db;

CREATE TABLE IF NOT EXISTS tickets (
    ticket_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    engineer_id BIGINT,
    ticket_type ENUM('INSTALLATION', 'FAULT') NOT NULL,
    description VARCHAR(1000) NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DOUBLE,
    longitude DOUBLE,
    priority ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL,
    status ENUM('OPEN', 'ASSIGNED', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'SUCCESS', 'FAILURE', 'DEFERRED') NOT NULL DEFAULT 'OPEN',
    admin_notes VARCHAR(500),
    user_name VARCHAR(100),
    engineer_name VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_engineer_id (engineer_id),
    INDEX idx_status (status),
    INDEX idx_ticket_type (ticket_type)
);

-- ============================================
-- ENGINEER DATABASE - Engineers & Hazards Tables
-- ============================================
USE sts_engineer_db;

CREATE TABLE IF NOT EXISTS engineers (
    engineer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    specialization VARCHAR(100),
    home_location VARCHAR(255),
    home_latitude DOUBLE,
    home_longitude DOUBLE,
    workload INT NOT NULL DEFAULT 0,
    holiday_start DATE,
    holiday_end DATE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_available (is_available)
);

CREATE TABLE IF NOT EXISTS hazards (
    hazard_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    latitude DOUBLE,
    longitude DOUBLE,
    hazard_type VARCHAR(100) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    reported_by BIGINT,
    reporter_name VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_location (location),
    INDEX idx_severity (severity)
);
