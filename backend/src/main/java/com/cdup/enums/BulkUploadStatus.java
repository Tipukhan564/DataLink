package com.cdup.enums;

public enum BulkUploadStatus {
    UPLOADED("Uploaded"),
    VALIDATING("Validating"),
    VALIDATED("Validated"),
    PROCESSING("Processing"),
    COMPLETED("Completed"),
    PARTIALLY_COMPLETED("Partially Completed"),
    FAILED("Failed"),
    CANCELLED("Cancelled");

    private final String displayName;

    BulkUploadStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public boolean isTerminal() {
        return this == COMPLETED || this == FAILED || this == CANCELLED || this == PARTIALLY_COMPLETED;
    }

    public boolean isProcessing() {
        return this == VALIDATING || this == PROCESSING;
    }
}
