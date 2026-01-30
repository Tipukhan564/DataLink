package com.cdup.enums;

public enum PurposeOfAccount {
<<<<<<< HEAD
    PERSONAL,
    BUSINESS,
    SAVING,
    HAJJ,
    NORMAL_USE,
    ONLINE_TRANSACTION,
    FREELANCING,
    OTHER;

    @Override
    public String toString() {
        return name().replace('_', ' ');
    }
}
=======
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
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
