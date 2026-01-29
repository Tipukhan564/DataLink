-- V4__add_bulk_upload_tables.sql
-- Bulk upload management tables

CREATE TABLE bulk_uploads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255),
    file_size BIGINT,
    file_path VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'UPLOADED',
    total_records INT DEFAULT 0,
    processed_records INT DEFAULT 0,
    success_count INT DEFAULT 0,
    failure_count INT DEFAULT 0,
    error_message TEXT,
    uploaded_by BIGINT NOT NULL,
    processed_by BIGINT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    FOREIGN KEY (processed_by) REFERENCES users(id)
);

CREATE TABLE bulk_upload_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bulk_upload_id BIGINT NOT NULL,
    row_number INT,
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
    status VARCHAR(20) DEFAULT 'PENDING',
    error_message VARCHAR(500),
    processed_at TIMESTAMP,
    request_id BIGINT,
    FOREIGN KEY (bulk_upload_id) REFERENCES bulk_uploads(id) ON DELETE CASCADE,
    FOREIGN KEY (request_id) REFERENCES customer_update_requests(id)
);

CREATE INDEX idx_bulk_uploads_status ON bulk_uploads(status);
CREATE INDEX idx_bulk_uploads_user ON bulk_uploads(uploaded_by);
CREATE INDEX idx_bulk_upload_items_upload ON bulk_upload_items(bulk_upload_id);
CREATE INDEX idx_bulk_upload_items_status ON bulk_upload_items(status);
