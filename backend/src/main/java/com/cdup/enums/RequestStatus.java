package com.cdup.enums;

public enum RequestStatus {
<<<<<<< HEAD
    PENDING,
    APPROVED,
    REJECTED,
    PROCESSING,
    COMPLETED,
    FAILED
=======
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
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
}
