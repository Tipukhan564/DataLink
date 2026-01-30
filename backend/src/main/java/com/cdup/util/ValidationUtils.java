package com.cdup.util;

import java.util.regex.Pattern;

public final class ValidationUtils {

    private static final Pattern CNIC_PATTERN = Pattern.compile("^\\d{5}-\\d{7}-\\d{1}$");
    private static final Pattern CNIC_PLAIN_PATTERN = Pattern.compile("^\\d{13}$");
    private static final Pattern MOBILE_PATTERN = Pattern.compile("^03\\d{9}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    private static final Pattern LATITUDE_PATTERN = Pattern.compile("^-?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?)$");
    private static final Pattern LONGITUDE_PATTERN = Pattern.compile("^-?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)$");

    private ValidationUtils() {}

    public static boolean isValidCnic(String cnic) {
        if (cnic == null || cnic.isBlank()) return false;
        return CNIC_PATTERN.matcher(cnic).matches() || CNIC_PLAIN_PATTERN.matcher(cnic).matches();
    }

    public static boolean isValidMobile(String mobile) {
        if (mobile == null || mobile.isBlank()) return false;
        String cleaned = mobile.replaceAll("[^0-9]", "");
        return MOBILE_PATTERN.matcher(cleaned).matches();
    }

    public static boolean isValidEmail(String email) {
        if (email == null || email.isBlank()) return false;
        return EMAIL_PATTERN.matcher(email).matches();
    }

    public static boolean isValidLatitude(String latitude) {
        if (latitude == null || latitude.isBlank()) return true; // Optional field
        return LATITUDE_PATTERN.matcher(latitude).matches();
    }

    public static boolean isValidLongitude(String longitude) {
        if (longitude == null || longitude.isBlank()) return true; // Optional field
        return LONGITUDE_PATTERN.matcher(longitude).matches();
    }

    public static String formatCnic(String cnic) {
        if (cnic == null) return null;
        String digits = cnic.replaceAll("[^0-9]", "");
        if (digits.length() == 13) {
            return digits.substring(0, 5) + "-" + digits.substring(5, 12) + "-" + digits.substring(12);
        }
        return cnic;
    }

    public static String formatMobile(String mobile) {
        if (mobile == null) return null;
        return mobile.replaceAll("[^0-9]", "");
    }

    public static boolean validateCnicChecksum(String cnic) {
        String digits = cnic.replaceAll("[^0-9]", "");
        if (digits.length() != 13) return false;

        int[] weights = {7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3};
        int sum = 0;
        for (int i = 0; i < 12; i++) {
            sum += Character.getNumericValue(digits.charAt(i)) * weights[i];
        }
        int checkDigit = sum % 10;
        return checkDigit == Character.getNumericValue(digits.charAt(12));
    }
}
