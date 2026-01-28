package com.cdup.entity;

import com.cdup.enums.PurposeOfAccount;
import com.cdup.enums.RequestStatus;
import com.cdup.enums.SourceOfIncome;
import jakarta.persistence.*;

@Entity
@Table(name = "customer_update_requests")
public class CustomerUpdateRequest extends BaseEntity {

    @Column(name = "complaint_number", length = 50)
    private String complaintNumber;

    @Column(nullable = false, length = 15)
    private String cnic;

    @Column(name = "mobile_number", nullable = false, length = 15)
    private String mobileNumber;

    @Column(name = "next_of_kin", length = 100)
    private String nextOfKin;

    @Column(length = 100)
    private String email;

    @Column(name = "father_name", length = 100)
    private String fatherName;

    @Column(name = "mother_name", length = 100)
    private String motherName;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_of_income", length = 30)
    private SourceOfIncome sourceOfIncome;

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose_of_account", length = 30)
    private PurposeOfAccount purposeOfAccount;

    @Column(length = 20)
    private String latitude;

    @Column(length = 20)
    private String longitude;

    @Column(name = "cc_remarks", length = 500)
    private String ccRemarks;

    @Column(name = "selfie_cnic_verified")
    private boolean selfieCnicVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RequestStatus status = RequestStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by")
    private User submittedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approval_comments", length = 500)
    private String approvalComments;

    @Column(name = "approved_at")
    private java.time.LocalDateTime approvedAt;

    @Column(name = "processed_at")
    private java.time.LocalDateTime processedAt;

    @Column(name = "error_message", length = 1000)
    private String errorMessage;

    @Column(name = "batch_id")
    private Long batchId;

    @Column(name = "db_execution_result", length = 2000)
    private String dbExecutionResult;

    public CustomerUpdateRequest() {}

    // Getters and Setters
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
    public SourceOfIncome getSourceOfIncome() { return sourceOfIncome; }
    public void setSourceOfIncome(SourceOfIncome sourceOfIncome) { this.sourceOfIncome = sourceOfIncome; }
    public PurposeOfAccount getPurposeOfAccount() { return purposeOfAccount; }
    public void setPurposeOfAccount(PurposeOfAccount purposeOfAccount) { this.purposeOfAccount = purposeOfAccount; }
    public String getLatitude() { return latitude; }
    public void setLatitude(String latitude) { this.latitude = latitude; }
    public String getLongitude() { return longitude; }
    public void setLongitude(String longitude) { this.longitude = longitude; }
    public String getCcRemarks() { return ccRemarks; }
    public void setCcRemarks(String ccRemarks) { this.ccRemarks = ccRemarks; }
    public boolean isSelfieCnicVerified() { return selfieCnicVerified; }
    public void setSelfieCnicVerified(boolean selfieCnicVerified) { this.selfieCnicVerified = selfieCnicVerified; }
    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
    public User getSubmittedBy() { return submittedBy; }
    public void setSubmittedBy(User submittedBy) { this.submittedBy = submittedBy; }
    public User getApprovedBy() { return approvedBy; }
    public void setApprovedBy(User approvedBy) { this.approvedBy = approvedBy; }
    public String getApprovalComments() { return approvalComments; }
    public void setApprovalComments(String approvalComments) { this.approvalComments = approvalComments; }
    public java.time.LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(java.time.LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    public java.time.LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(java.time.LocalDateTime processedAt) { this.processedAt = processedAt; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public Long getBatchId() { return batchId; }
    public void setBatchId(Long batchId) { this.batchId = batchId; }
    public String getDbExecutionResult() { return dbExecutionResult; }
    public void setDbExecutionResult(String dbExecutionResult) { this.dbExecutionResult = dbExecutionResult; }
}
