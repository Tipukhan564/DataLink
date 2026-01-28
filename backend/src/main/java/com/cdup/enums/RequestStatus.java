package com.cdup.enums;

public enum RequestStatus {
    PENDING("Pending"),
    APPROVED("Approved"),
    REJECTED("Rejected"),
    PROCESSING("Processing"),
    COMPLETED("Completed"),
    FAILED("Failed");

    private final String displayName;

    RequestStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() { return displayName; }
}
