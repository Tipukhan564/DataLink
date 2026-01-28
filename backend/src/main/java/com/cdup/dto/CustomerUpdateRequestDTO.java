package com.cdup.dto;

import jakarta.validation.constraints.*;

public class CustomerUpdateRequestDTO {

    private Long id;

    private String complaintNumber;

    @NotBlank(message = "CNIC is required")
    @Pattern(regexp = "^\\d{5}-\\d{7}-\\d{1}$", message = "CNIC must be in format XXXXX-XXXXXXX-X")
    private String cnic;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^03\\d{9}$", message = "Mobile number must be in format 03XXXXXXXXX")
    private String mobileNumber;

    private String nextOfKin;

    @Email(message = "Invalid email format")
    private String email;

    private String fatherName;
    private String motherName;
    private String sourceOfIncome;
    private String purposeOfAccount;
    private String latitude;
    private String longitude;
    private String ccRemarks;
    private boolean selfieCnicVerified;
    private String status;
    private String submittedByName;
    private String approvedByName;
    private String approvalComments;
    private String createdAt;
    private String processedAt;
    private String errorMessage;
    private Long batchId;

    public CustomerUpdateRequestDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getComplaintNumber() { return complaintNumber; }
    public void setComplaintNumber(String complaintNumber) { this.complaintNumber = complaintNumber; }
    public String getCnic() { return cnic; }
    public void setCnic(String cnic) { this.cnic = cnic; }
    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
    public String getNextOfKin() { return nextOfKin; }
    public void setNextOfKin(String nextOfKin) { this.nextOfKin = nextOfKin; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }
    public String getMotherName() { return motherName; }
    public void setMotherName(String motherName) { this.motherName = motherName; }
    public String getSourceOfIncome() { return sourceOfIncome; }
    public void setSourceOfIncome(String sourceOfIncome) { this.sourceOfIncome = sourceOfIncome; }
    public String getPurposeOfAccount() { return purposeOfAccount; }
    public void setPurposeOfAccount(String purposeOfAccount) { this.purposeOfAccount = purposeOfAccount; }
    public String getLatitude() { return latitude; }
    public void setLatitude(String latitude) { this.latitude = latitude; }
    public String getLongitude() { return longitude; }
    public void setLongitude(String longitude) { this.longitude = longitude; }
    public String getCcRemarks() { return ccRemarks; }
    public void setCcRemarks(String ccRemarks) { this.ccRemarks = ccRemarks; }
    public boolean isSelfieCnicVerified() { return selfieCnicVerified; }
    public void setSelfieCnicVerified(boolean selfieCnicVerified) { this.selfieCnicVerified = selfieCnicVerified; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getSubmittedByName() { return submittedByName; }
    public void setSubmittedByName(String submittedByName) { this.submittedByName = submittedByName; }
    public String getApprovedByName() { return approvedByName; }
    public void setApprovedByName(String approvedByName) { this.approvedByName = approvedByName; }
    public String getApprovalComments() { return approvalComments; }
    public void setApprovalComments(String approvalComments) { this.approvalComments = approvalComments; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getProcessedAt() { return processedAt; }
    public void setProcessedAt(String processedAt) { this.processedAt = processedAt; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public Long getBatchId() { return batchId; }
    public void setBatchId(Long batchId) { this.batchId = batchId; }
}
