package com.cdup.enums;

public enum SourceOfIncome {
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