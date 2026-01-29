-- V3__add_workflow_tables.sql
-- Workflow management tables

CREATE TABLE workflows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    requires_approval BOOLEAN DEFAULT TRUE,
    auto_process BOOLEAN DEFAULT FALSE,
    approval_threshold INT DEFAULT 1,
    escalation_hours INT DEFAULT 24,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE workflow_steps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    workflow_id BIGINT NOT NULL,
    step_order INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    required_role VARCHAR(20),
    is_mandatory BOOLEAN DEFAULT TRUE,
    timeout_hours INT DEFAULT 24,
    can_skip BOOLEAN DEFAULT FALSE,
    notify_on_pending BOOLEAN DEFAULT TRUE,
    notify_on_complete BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
);

CREATE INDEX idx_workflow_active ON workflows(is_active);
CREATE INDEX idx_workflow_steps_order ON workflow_steps(workflow_id, step_order);

-- Insert default workflow
INSERT INTO workflows (name, description, requires_approval, escalation_hours)
VALUES ('default', 'Default customer update workflow', TRUE, 24);

INSERT INTO workflow_steps (workflow_id, step_order, name, required_role, is_mandatory)
VALUES
    ((SELECT id FROM workflows WHERE name = 'default'), 1, 'Submission', 'AGENT', TRUE),
    ((SELECT id FROM workflows WHERE name = 'default'), 2, 'Approval', 'SUPERVISOR', TRUE),
    ((SELECT id FROM workflows WHERE name = 'default'), 3, 'Processing', 'ENGINEER', TRUE);
