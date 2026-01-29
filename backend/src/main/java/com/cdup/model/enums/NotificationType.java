package com.cdup.model.enums;

public enum NotificationType {
    REQUEST_SUBMITTED("Request Submitted", "info"),
    REQUEST_APPROVED("Request Approved", "success"),
    REQUEST_REJECTED("Request Rejected", "error"),
    REQUEST_COMPLETED("Request Completed", "success"),
    REQUEST_FAILED("Request Failed", "error"),
    BULK_UPLOAD_STARTED("Bulk Upload Started", "info"),
    BULK_UPLOAD_COMPLETED("Bulk Upload Completed", "success"),
    BULK_UPLOAD_FAILED("Bulk Upload Failed", "error"),
    APPROVAL_PENDING("Approval Pending", "warning"),
    ESCALATION_ALERT("Escalation Alert", "warning"),
    SYSTEM_MAINTENANCE("System Maintenance", "info"),
    PASSWORD_EXPIRY("Password Expiry", "warning"),
    LOGIN_ALERT("Login Alert", "info");

    private final String displayName;
    private final String severity;

    NotificationType(String displayName, String severity) {
        this.displayName = displayName;
        this.severity = severity;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getSeverity() {
        return severity;
    }
}
