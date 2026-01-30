package com.cdup.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CustomerUpdateDTO {
    
    // Changed from fNumber to mobileNumber to match database
    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^(03\\d{9}|\\+923\\d{9})$", message = "Invalid mobile number format (e.g., 03001234567)")
    private String mobileNumber;

    @NotBlank(message = "CNIC is required")
    @Pattern(regexp = "^\\d{5}-?\\d{7}-?\\d{1}$", message = "Invalid CNIC format (e.g., 42201-1234567-1)")
    private String cnic;

    @NotBlank(message = "Father's name is required")
    private String fatherName;

    @NotBlank(message = "Mother's name is required")
    private String motherName;

    // Changed from nextOfKinName to nextOfKin to match database
    @NotBlank(message = "Next of kin is required")
    private String nextOfKin;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    // Optional complaint number
    private String complaintNumber;
    
    // Required account information
    @NotBlank(message = "Source of income is required")
    private String sourceOfIncome;
    
    @NotBlank(message = "Purpose of account is required")
    private String purposeOfAccount;
    
    // Coordinates with default values
    private String latitude;
    private String longitude;
    
    // Optional call center remarks
    private String ccRemarks;
    
    // Verification flag (not used in UI but kept for database compatibility)
    private Boolean selfieCnicVerified;

    // REMOVED: All MultipartFile fields (selfie, cnicFront, cnicBack)
    // These are no longer needed as we removed file upload functionality
}