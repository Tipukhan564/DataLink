-- V4__add_bulk_upload_tables.sql
-- Bulk upload functionality tables for MySQL

-- Bulk Uploads table for tracking file uploads
CREATE TABLE IF NOT EXISTS bulk_uploads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_size BIGINT,
    content_type VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    total_records INT DEFAULT 0,
    processed_records INT DEFAULT 0,
    success_count INT DEFAULT 0,
    failure_count INT DEFAULT 0,
    error_file_path VARCHAR(500),
    uploaded_by BIGINT NOT NULL,
    processed_by BIGINT,
    upload_started_at DATETIME,
    processing_started_at DATETIME,
    processing_completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_bulk_uploads_status (status),
    INDEX idx_bulk_uploads_uploaded_by (uploaded_by),
    INDEX idx_bulk_uploads_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bulk Upload Items table for individual records from bulk uploads
CREATE TABLE IF NOT EXISTS bulk_upload_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bulk_upload_id BIGINT NOT NULL,
    row_number INT NOT NULL,
    cnic VARCHAR(15),
    mobile_number VARCHAR(15),
    next_of_kin VARCHAR(100),
    email VARCHAR(100),
    father_name VARCHAR(100),
    mother_name VARCHAR(100),
    source_of_income VARCHAR(50),
    purpose_of_account VARCHAR(50),
    latitude VARCHAR(20),
    longitude VARCHAR(20),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    error_message TEXT,
    request_id BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bulk_upload_id) REFERENCES bulk_uploads(id) ON DELETE CASCADE,
    FOREIGN KEY (request_id) REFERENCES customer_update_requests(id) ON DELETE SET NULL,
    INDEX idx_bulk_upload_items_upload (bulk_upload_id),
    INDEX idx_bulk_upload_items_status (status),
    INDEX idx_bulk_upload_items_row (row_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
