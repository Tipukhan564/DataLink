-- V1__initial_schema.sql
-- Initial database schema for CDUP

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    department VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'AGENT',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    active BOOLEAN DEFAULT TRUE,
    locked BOOLEAN DEFAULT FALSE,
    failed_login_attempts INT DEFAULT 0,
    last_login TIMESTAMP,
    password_changed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

-- Customer Update Requests table
CREATE TABLE customer_update_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_number VARCHAR(50),
    cnic VARCHAR(15) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    next_of_kin VARCHAR(100),
    email VARCHAR(100),
    father_name VARCHAR(100),
    mother_name VARCHAR(100),
    source_of_income VARCHAR(50),
    purpose_of_account VARCHAR(50),
    latitude VARCHAR(20),
    longitude VARCHAR(20),
    cc_remarks TEXT,
    selfie_cnic_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    submitted_by BIGINT NOT NULL,
    approved_by BIGINT,
    processed_by BIGINT,
    approval_comments TEXT,
    rejection_reason TEXT,
    processing_result TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submitted_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (processed_by) REFERENCES users(id)
);

-- Create indexes
CREATE INDEX idx_requests_cnic ON customer_update_requests(cnic);
CREATE INDEX idx_requests_mobile ON customer_update_requests(mobile_number);
CREATE INDEX idx_requests_status ON customer_update_requests(status);
CREATE INDEX idx_requests_submitted_by ON customer_update_requests(submitted_by);
CREATE INDEX idx_requests_created_at ON customer_update_requests(created_at);

-- Create indexes for users
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(active);
