package com.cdup.enums;

public enum SourceOfIncome {
<<<<<<< HEAD
    SALARY,
    BUSINESS,
    FREELANCER,
    LABOUR,
    GOVERNMENT_TEACHER,
    FAJAR_COLLECTION,
    OTHER;

    @Override
    public String toString() {
        return name().replace('_', ' ');
    }
}
=======
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
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
