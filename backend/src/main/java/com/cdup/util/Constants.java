package com.cdup.util;

public final class Constants {

    private Constants() {}

    // API Versioning
    public static final String API_V1 = "/api/v1";

    // Pagination
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_FIELD = "createdAt";
    public static final String DEFAULT_SORT_DIR = "desc";

    // File Upload
    public static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    public static final String[] ALLOWED_EXCEL_EXTENSIONS = {".xlsx", ".xls"};
    public static final String UPLOAD_DIR = "./uploads";

    // Security
    public static final int MAX_LOGIN_ATTEMPTS = 5;
    public static final int ACCOUNT_LOCK_DURATION_MINUTES = 30;
    public static final int PASSWORD_MIN_LENGTH = 8;
    public static final int SESSION_TIMEOUT_MINUTES = 30;

    // Bulk Upload
    public static final int BULK_UPLOAD_BATCH_SIZE = 100;
    public static final int MAX_BULK_UPLOAD_ROWS = 10000;

    // Date Formats
    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String TIME_FORMAT = "HH:mm:ss";

    // Audit
    public static final String AUDIT_ACTION_CREATE = "CREATE";
    public static final String AUDIT_ACTION_UPDATE = "UPDATE";
    public static final String AUDIT_ACTION_DELETE = "DELETE";
    public static final String AUDIT_ACTION_LOGIN = "LOGIN";
    public static final String AUDIT_ACTION_LOGOUT = "LOGOUT";
    public static final String AUDIT_ACTION_APPROVE = "APPROVE";
    public static final String AUDIT_ACTION_REJECT = "REJECT";

    // Cache Keys
    public static final String CACHE_KEY_DASHBOARD_STATS = "dashboard_stats";
    public static final String CACHE_KEY_ENUM_VALUES = "enum_values";

    // Stored Procedure
    public static final String PROC_BLINK_MYTM = "PROC_BLINK_MYTM";
}
