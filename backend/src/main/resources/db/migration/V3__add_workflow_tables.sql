-- V3__add_workflow_tables.sql
-- Workflow management tables for MySQL

-- Workflows table for defining approval workflows
CREATE TABLE IF NOT EXISTS workflows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    requires_approval BOOLEAN DEFAULT TRUE,
    auto_process BOOLEAN DEFAULT FALSE,
    approval_threshold INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_workflows_name (name),
    INDEX idx_workflows_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Workflow Steps table for defining workflow steps
CREATE TABLE IF NOT EXISTS workflow_steps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    workflow_id BIGINT NOT NULL,
    step_order INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    required_role VARCHAR(20),
    is_mandatory BOOLEAN DEFAULT TRUE,
    timeout_hours INT DEFAULT 24,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE,
    INDEX idx_workflow_steps_workflow (workflow_id),
    INDEX idx_workflow_steps_order (step_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default workflow
INSERT INTO workflows (name, description, requires_approval, auto_process, approval_threshold)
VALUES ('Standard Customer Update', 'Standard workflow for customer data updates requiring supervisor approval', TRUE, FALSE, 1);
