package com.cdup.enums;

public enum SourceOfIncome {
    SALARY("Salary"),
    BUSINESS("Business Income"),
    AGRICULTURE("Agriculture"),
    RENTAL("Rental Income"),
    PENSION("Pension"),
    REMITTANCE("Foreign Remittance"),
    INVESTMENT("Investment Income"),
    FREELANCE("Freelance/Consultancy"),
    OTHER("Other");

    private final String displayName;

    SourceOfIncome(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() { return displayName; }
}
