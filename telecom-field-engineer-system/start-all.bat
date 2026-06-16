@echo off
title Start STS Services
echo ===================================================
echo Starting SwiftLink Telecom Services (STS)
echo ===================================================

:: Define the Maven path from VS Code Java extension
set MAVEN_CMD="C:\Users\ASHAY SHEREKAR\.vscode\extensions\oracle.oracle-java-26.0.0\nbcode\java\maven\bin\mvn.cmd"

:: Fall back to global "mvn" if the custom path doesn't exist
if not exist %MAVEN_CMD% (
    set MAVEN_CMD=mvn
)

:: 1. Start Eureka Discovery Server
echo [1/5] Starting Eureka Discovery Server on port 8761...
start "Eureka Server" cmd /k "cd /d eureka-server && %MAVEN_CMD% spring-boot:run"

:: Wait for Eureka to initialize (12 seconds) so other services can register successfully
echo Waiting 12 seconds for Eureka Server to fully boot...
timeout /t 12 /nobreak > nul

:: 2. Start Authentication Service
echo [2/5] Starting Authentication Service on port 8081...
start "Auth Service" cmd /k "cd /d auth-service && %MAVEN_CMD% spring-boot:run"

:: 3. Start Ticket Service
echo [3/5] Starting Ticket Service on port 8082...
start "Ticket Service" cmd /k "cd /d ticket-service && %MAVEN_CMD% spring-boot:run"

:: 4. Start Engineer Service
echo [4/5] Starting Engineer Service on port 8083...
start "Engineer Service" cmd /k "cd /d engineer-service && %MAVEN_CMD% spring-boot:run"

:: 5. Start Angular Frontend
echo [5/5] Starting Angular Frontend on port 4200...
start "Angular Frontend" cmd /k "cd /d frontend-angular && npm start -- --open"

echo ===================================================
echo All services have been launched in separate windows!
echo You can monitor logs and stop individual services there.
echo ===================================================
pause
