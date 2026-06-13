-- ============================================
-- STS Field Engineer Task Management System
-- Sample Data for Demonstration
-- Geography: Bangalore
-- ============================================

-- ============================================
-- AUTH DATABASE - Sample Users
-- ============================================
-- Note: Passwords are stored as encrypted by Encrypt-js on the frontend.
-- For demo, using SHA-256 hash of "password123" (ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f)
USE sts_auth_db;

-- Admin user
INSERT INTO users (name, email, password, role, phone, address, security_question, security_answer) VALUES
('Rajesh Kumar', 'admin@sts.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'ADMIN', '9876543210', 'MG Road, Bangalore', 'What is your pet name?', 'tommy'),

-- Regular users
('Priya Sharma', 'priya@email.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'USER', '9876543211', 'Indiranagar, Bangalore', 'What city were you born in?', 'mumbai'),
('Amit Patel', 'amit@email.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'USER', '9876543212', 'Jayanagar, Bangalore', 'What is your favorite color?', 'blue'),

-- Engineer users (also registered in auth for login)
('Suresh Reddy', 'suresh@sts.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'ENGINEER', '9876543213', 'Koramangala, Bangalore', 'What is your pet name?', 'rocky'),
('Deepak Nair', 'deepak@sts.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'ENGINEER', '9876543214', 'Whitefield, Bangalore', 'What city were you born in?', 'kerala'),
('Karthik Iyer', 'karthik@sts.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'ENGINEER', '9876543215', 'Jayanagar, Bangalore', 'What is your favorite color?', 'green'),
('Vikram Singh', 'vikram@sts.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'ENGINEER', '9876543216', 'Electronic City, Bangalore', 'What is your pet name?', 'bruno');

-- ============================================
-- ENGINEER DATABASE - Engineer Profiles
-- ============================================
-- Coordinates are real Bangalore area locations
USE sts_engineer_db;

INSERT INTO engineers (name, email, password, specialization, home_location, home_latitude, home_longitude, workload, is_available) VALUES
('Suresh Reddy', 'suresh@sts.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Fiber', 'Koramangala', 12.9352, 77.6245, 2, TRUE),
('Deepak Nair', 'deepak@sts.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Copper', 'Whitefield', 12.9698, 77.7500, 1, TRUE),
('Karthik Iyer', 'karthik@sts.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Installation', 'Jayanagar', 12.9250, 77.5938, 0, TRUE),
('Vikram Singh', 'vikram@sts.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'General', 'Electronic City', 12.8440, 77.6760, 3, TRUE);

-- ============================================
-- TICKET DATABASE - Sample Tickets
-- ============================================
USE sts_ticket_db;

-- Open ticket (not yet assigned)
INSERT INTO tickets (user_id, ticket_type, description, location, latitude, longitude, priority, status, user_name) VALUES
(2, 'FAULT', 'Internet connection down since morning. No signal on router.', 'HSR Layout', 12.9121, 77.6446, 'HIGH', 'OPEN', 'Priya Sharma'),

-- Assigned ticket (waiting for engineer response)
(3, 'INSTALLATION', 'New fiber connection installation requested for office.', 'Koramangala 5th Block', 12.9340, 77.6210, 'MEDIUM', 'ASSIGNED', 'Amit Patel'),

-- Accepted and in progress
(2, 'FAULT', 'Cable cut near junction box. Multiple users affected.', 'Indiranagar 100ft Road', 12.9784, 77.6408, 'HIGH', 'IN_PROGRESS', 'Priya Sharma'),

-- Completed ticket
(3, 'INSTALLATION', 'Set-top box installation and configuration.', 'JP Nagar 6th Phase', 12.8912, 77.5853, 'MEDIUM', 'SUCCESS', 'Amit Patel'),

-- Deferred ticket (needs reassignment - FR14, FR15)
(2, 'FAULT', 'Fiber optic cable damage due to construction work.', 'Marathahalli Bridge', 12.9591, 77.7009, 'HIGH', 'DEFERRED', 'Priya Sharma'),

-- Failed ticket (admin alert - FR14)
(3, 'FAULT', 'Network switch malfunction at exchange.', 'Whitefield Main Road', 12.9698, 77.7500, 'HIGH', 'FAILURE', 'Amit Patel');

-- Update assigned/in-progress tickets with engineer info
UPDATE tickets SET engineer_id = 1, engineer_name = 'Suresh Reddy' WHERE ticket_id = 2;
UPDATE tickets SET engineer_id = 2, engineer_name = 'Deepak Nair' WHERE ticket_id = 3;
UPDATE tickets SET engineer_id = 3, engineer_name = 'Karthik Iyer' WHERE ticket_id = 4;
UPDATE tickets SET engineer_id = 1, engineer_name = 'Suresh Reddy' WHERE ticket_id = 5;
UPDATE tickets SET engineer_id = 4, engineer_name = 'Vikram Singh' WHERE ticket_id = 6;

-- ============================================
-- ENGINEER DATABASE - Sample Hazards
-- ============================================
USE sts_engineer_db;

INSERT INTO hazards (location, latitude, longitude, hazard_type, description, severity, reported_by, reporter_name) VALUES
('Koramangala 5th Block', 12.9340, 77.6210, 'Electrical', 'Exposed high-voltage cables near pole #KR-45. Risk of electrocution.', 'CRITICAL', 1, 'Suresh Reddy'),
('Whitefield Main Road', 12.9698, 77.7500, 'Structural', 'Unstable manhole cover near junction box WF-12. Fall hazard.', 'HIGH', 2, 'Deepak Nair'),
('HSR Layout Sector 2', 12.9121, 77.6446, 'Environmental', 'Waterlogging near underground cable duct. Equipment damage risk.', 'MEDIUM', 1, 'Suresh Reddy'),
('Electronic City Phase 1', 12.8440, 77.6760, 'Chemical', 'Chemical spill near telecom tower EC-03. Protective gear required.', 'HIGH', 4, 'Vikram Singh');
