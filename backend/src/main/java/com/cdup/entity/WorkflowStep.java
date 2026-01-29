package com.cdup.entity;

import com.cdup.enums.UserRole;
import jakarta.persistence.*;

@Entity
@Table(name = "workflow_steps")
public class WorkflowStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id", nullable = false)
    private Workflow workflow;

    @Column(name = "step_order", nullable = false)
    private Integer stepOrder;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "required_role", length = 20)
    private UserRole requiredRole;

    @Column(name = "is_mandatory")
    private boolean mandatory = true;

    @Column(name = "timeout_hours")
    private Integer timeoutHours = 24;

    @Column(name = "can_skip")
    private boolean canSkip = false;

    @Column(name = "notify_on_pending")
    private boolean notifyOnPending = true;

    @Column(name = "notify_on_complete")
    private boolean notifyOnComplete = true;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Workflow getWorkflow() { return workflow; }
    public void setWorkflow(Workflow workflow) { this.workflow = workflow; }

    public Integer getStepOrder() { return stepOrder; }
    public void setStepOrder(Integer stepOrder) { this.stepOrder = stepOrder; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public UserRole getRequiredRole() { return requiredRole; }
    public void setRequiredRole(UserRole requiredRole) { this.requiredRole = requiredRole; }

    public boolean isMandatory() { return mandatory; }
    public void setMandatory(boolean mandatory) { this.mandatory = mandatory; }

    public Integer getTimeoutHours() { return timeoutHours; }
    public void setTimeoutHours(Integer timeoutHours) { this.timeoutHours = timeoutHours; }

    public boolean isCanSkip() { return canSkip; }
    public void setCanSkip(boolean canSkip) { this.canSkip = canSkip; }

    public boolean isNotifyOnPending() { return notifyOnPending; }
    public void setNotifyOnPending(boolean notifyOnPending) { this.notifyOnPending = notifyOnPending; }

    public boolean isNotifyOnComplete() { return notifyOnComplete; }
    public void setNotifyOnComplete(boolean notifyOnComplete) { this.notifyOnComplete = notifyOnComplete; }
}
