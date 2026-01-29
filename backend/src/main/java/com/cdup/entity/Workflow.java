package com.cdup.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workflows")
public class Workflow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(name = "is_active")
    private boolean active = true;

    @Column(name = "requires_approval")
    private boolean requiresApproval = true;

    @Column(name = "auto_process")
    private boolean autoProcess = false;

    @Column(name = "approval_threshold")
    private Integer approvalThreshold = 1;

    @Column(name = "escalation_hours")
    private Integer escalationHours = 24;

    @OneToMany(mappedBy = "workflow", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stepOrder ASC")
    private List<WorkflowStep> steps = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public boolean isRequiresApproval() { return requiresApproval; }
    public void setRequiresApproval(boolean requiresApproval) { this.requiresApproval = requiresApproval; }

    public boolean isAutoProcess() { return autoProcess; }
    public void setAutoProcess(boolean autoProcess) { this.autoProcess = autoProcess; }

    public Integer getApprovalThreshold() { return approvalThreshold; }
    public void setApprovalThreshold(Integer approvalThreshold) { this.approvalThreshold = approvalThreshold; }

    public Integer getEscalationHours() { return escalationHours; }
    public void setEscalationHours(Integer escalationHours) { this.escalationHours = escalationHours; }

    public List<WorkflowStep> getSteps() { return steps; }
    public void setSteps(List<WorkflowStep> steps) { this.steps = steps; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public void addStep(WorkflowStep step) {
        steps.add(step);
        step.setWorkflow(this);
    }

    public void removeStep(WorkflowStep step) {
        steps.remove(step);
        step.setWorkflow(null);
    }
}
