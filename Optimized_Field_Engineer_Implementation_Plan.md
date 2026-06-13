# Optimized Field Engineer Task Management System

## Detailed Implementation Plan (Working Baseline)

> **Version:** 1.0\
> **Project Duration:** 3 Days (MVP)\
> **Development Environment:** Antigravity IDE\
> **Approach:** Strictly follow the provided project specification and
> confirmed curriculum technologies.

------------------------------------------------------------------------

# 1. Project Overview

## Problem Statement

SwiftLink Telecom Services (STS) manages field engineers responsible for
telecom installation and fault resolution activities. The objective of
this project is to build a centralized task management platform where: -
Users can register and raise tickets. - Admins can monitor and assign
tickets. - Engineers can accept, reject, and update assigned tasks. -
Hazard information can be managed and viewed. - Engineer assignment
considers location, workload, holidays, and service type.

------------------------------------------------------------------------

# 2. Confirmed Technology Stack

## Backend

-   Java
-   Spring Boot
-   Spring Data JPA
-   REST APIs
-   Maven
-   Eureka Server (Service Discovery)

## Frontend

-   Angular
-   HTML5
-   CSS3
-   JavaScript
-   Leaflet API

## Database

-   MySQL

## Security

-   Encrypt-js (as specified in the project document)

## Development Tools

-   Antigravity IDE
-   Git
-   Postman
-   Docker (basic support)

------------------------------------------------------------------------

# 3. Technologies Kept in Reserve Mode

The following technologies are NOT part of the baseline architecture
until explicitly confirmed:

-   Spring Security
-   JWT Authentication
-   Spring Cloud Gateway (API Gateway)
-   BCrypt Password Hashing
-   JavaMail / Spring Mail
-   Dedicated Notification Microservice
-   Docker Compose

These can be activated later without major architectural changes.

------------------------------------------------------------------------

# 4. High-Level Architecture

``` text
                    +---------------------------+
                    |    Angular Frontend       |
                    | HTML + CSS + JavaScript   |
                    +------------+--------------+
                                 |
                                 |
                           REST API Calls
                                 |
      ----------------------------------------------------------
      |                         |                             |
+-----v------+          +--------v-------+            +--------v-------+
| Auth       |          | Ticket Service |            | Engineer       |
| Service    |          |                |            | Service        |
+-----+------+          +--------+-------+            +--------+-------+
      |                          |                             |
      |                          |                             |
      +------------+-------------+--------------+--------------+
                   |                            |
                   |                    +-------v--------+
                   |                    | Hazard Module  |
                   |                    +-------+--------+
                   |                            |
                   +-------------+--------------+
                                 |
                          +------v------+
                          | Eureka      |
                          | Server      |
                          +------+------+
                                 |
                          +------v------+
                          |   MySQL     |
                          +-------------+
```

------------------------------------------------------------------------

# 5. Core Functional Modules

## User Module

-   Registration
-   Login
-   Raise Ticket
-   View Current Tickets
-   View Ticket History
-   Update Profile

## Admin Module

-   Login
-   View Users
-   View Engineers
-   View Tickets
-   Assign Engineer
-   Reassign Deferred Tickets
-   Hazard Management

## Engineer Module

-   Login
-   View Assigned Tasks
-   Accept / Reject Tasks
-   Update Task Status
-   View Hazard Information

## Hazard Module

-   Add Hazard
-   Update Hazard
-   Delete Hazard
-   View Hazard by Location

------------------------------------------------------------------------

# 6. Microservice Breakdown

## Service 1: Eureka Server

Responsibilities: - Service registration. - Service discovery.

## Service 2: Authentication Service

Responsibilities: - Registration. - Login. - Security question
management.

## Service 3: Ticket Service

Responsibilities: - Ticket CRUD. - Ticket assignment. - Ticket status
updates.

## Service 4: Engineer Service

Responsibilities: - Engineer information. - Task management. - Workload
management. - Holiday management.

> Note: Hazard functionality may initially be implemented inside
> Engineer Service for MVP simplicity unless a separate service is later
> required.

------------------------------------------------------------------------

# 7. Database Design

## USER

-   user_id
-   name
-   email
-   password
-   role
-   security_question
-   security_answer
-   address

## ENGINEER

-   engineer_id
-   name
-   email
-   password
-   home_location
-   workload
-   holiday_status

## TICKET

-   ticket_id
-   user_id
-   engineer_id
-   ticket_type
-   description
-   location
-   priority
-   status
-   created_at

## HAZARD

-   hazard_id
-   location
-   hazard_type
-   description
-   severity

------------------------------------------------------------------------

# 8. Ticket Assignment Logic (MVP)

Assignment Factors: 1. Service Type (FAULT \> INSTALLATION). 2. Engineer
Holiday Status. 3. Current Engineer Workload. 4. Distance between
Engineer and Fault Location.

Simple Flow: - Get available engineers. - Remove engineers on holiday. -
Compare workloads. - Compare distance using stored coordinates. - Assign
best candidate.

------------------------------------------------------------------------

# 9. Frontend Structure

``` text
frontend/
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── models/
│   │   ├── user/
│   │   ├── admin/
│   │   ├── engineer/
│   │   └── shared/
│   ├── assets/
│   └── environments/
```

Pages: - Login - Register - Forgot Password - User Dashboard - Raise
Ticket - Ticket History - Admin Dashboard - Engineer Dashboard - Hazard
Management

------------------------------------------------------------------------

# 10. Backend Folder Structure

``` text
telecom-field-engineer-system/
│
├── eureka-server/
├── auth-service/
├── ticket-service/
├── engineer-service/
├── frontend-angular/
├── database/
│   ├── schema.sql
│   └── sample-data.sql
├── docker/
└── docs/
```

------------------------------------------------------------------------

# 11. Three-Day Execution Plan

## Day 1 - Backend Foundation

### Morning

-   Create Git repository.
-   Create all Spring Boot projects.
-   Configure Maven.
-   Setup MySQL.
-   Build Eureka Server.

### Afternoon

-   Create entities.
-   Create repositories.
-   Build Authentication Service.

### Evening

-   Build Ticket Service.
-   Build Engineer Service.
-   Register services with Eureka.

Deliverable: - Backend APIs working in Postman. - Eureka dashboard
operational.

------------------------------------------------------------------------

## Day 2 - Angular Development

### Morning

-   Create Angular project.
-   Setup routing.
-   Build Login and Registration pages.

### Afternoon

-   Build User Dashboard.
-   Raise Ticket functionality.
-   Ticket History page.

### Evening

-   Build Admin Dashboard.
-   Build Engineer Dashboard.
-   Connect Angular to backend APIs.

Deliverable: - End-to-end ticket creation and viewing.

------------------------------------------------------------------------

## Day 3 - Integration and Polish

### Morning

-   Implement assignment logic.
-   Add hazard management.

### Afternoon

-   Integrate Leaflet maps.
-   Add Encrypt-js password handling.
-   Perform end-to-end testing.

### Evening

-   Create Dockerfile(s).
-   Generate sample data.
-   Capture screenshots.
-   Prepare presentation flow.

Deliverable: - Working MVP ready for demonstration.

------------------------------------------------------------------------

# 12. Antigravity IDE Development Strategy

Generate code incrementally:

1.  Eureka Server.
2.  Authentication Service.
3.  Ticket Service.
4.  Engineer Service.
5.  Angular Frontend.
6.  MySQL Integration.
7.  Leaflet Integration.
8.  Docker Support.

Avoid generating the complete project in a single prompt.

------------------------------------------------------------------------

# 13. Viva Preparation Notes

## Why Microservices?

To improve modularity, maintainability, and enable service discovery
using Eureka.

## Why Eureka?

To dynamically register and discover independent services.

## Why Angular?

Component-based frontend with clean separation of concerns.

## Why MySQL?

Reliable relational storage for ticketing and user management.

## Why Leaflet?

Open-source map library required for location visualization.

## Why Encrypt-js?

The project specification explicitly requires Encrypt-js for password
encryption.

------------------------------------------------------------------------

# 14. Reference Topics to Study

Priority 1: - Spring Boot Basics - REST APIs - Spring Data JPA - Angular
Components - MySQL CRUD - Eureka Server

Priority 2: - Leaflet Basics - Docker Basics - Git Workflow - Maven
Project Structure

------------------------------------------------------------------------

# 15. AI Development Agent (Use with Antigravity IDE)

## Role

You are a Senior Full Stack Java Architect with expertise in: - Java -
Spring Boot - Spring Data JPA - REST API Design - Angular -
HTML/CSS/JavaScript - MySQL - Eureka Service Discovery - Leaflet
Integration - Docker Fundamentals - Maven and Git

## Rules

1.  Follow the provided project specification exactly.
2.  Prefer simple, production-like code over advanced optimizations.
3.  Do NOT introduce technologies unless explicitly requested.
4.  Keep Spring Security, JWT, API Gateway, BCrypt, JavaMail, Docker
    Compose, and Notification Microservice in **Reserve Mode**.
5.  Generate modular, well-commented, beginner-friendly code.
6.  Explain every generated file, class, and endpoint.
7.  Use best practices for naming conventions and folder structure.
8.  When generating code, provide:
    -   Objective.
    -   File structure.
    -   Source code.
    -   Explanation.
    -   Testing steps.
9.  Assume the project will be presented in a technical viva, so code
    should be easy to explain.
10. Never remove or replace the confirmed technology stack without
    explicit approval.

## Development Goal

Build a clean, maintainable MVP of the Optimized Field Engineer Task
Management System using only the confirmed technologies and
architecture.
