package com.cdup.enums;

public enum UserRole {
    AGENT("Call Center Agent", 1),
    SUPERVISOR("Supervisor", 2),
    ENGINEER("Engineer", 3),
    AUDITOR("Auditor", 0),
    ADMIN("System Administrator", 4);

    private final String displayName;
    private final int accessLevel;

    UserRole(String displayName, int accessLevel) {
        this.displayName = displayName;
        this.accessLevel = accessLevel;
    }

    public String getDisplayName() { return displayName; }
    public int getAccessLevel() { return accessLevel; }
}
