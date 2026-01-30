package com.cdup.enums;

public enum PurposeOfAccount {
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