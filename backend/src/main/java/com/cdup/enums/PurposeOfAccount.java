package com.cdup.enums;

public enum PurposeOfAccount {
    SAVINGS("Savings"),
    SALARY("Salary Account"),
    BUSINESS("Business Transactions"),
    INVESTMENT("Investment"),
    REMITTANCE("Remittance"),
    LOAN("Loan Account"),
    UTILITY("Utility Payments"),
    OTHER("Other");

    private final String displayName;

    PurposeOfAccount(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() { return displayName; }
}
