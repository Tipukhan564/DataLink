package com.cdup.entity;

import com.cdup.enums.PurposeOfAccount;
import com.cdup.enums.RequestStatus;
import com.cdup.enums.SourceOfIncome;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "customer_update_requests")
public class CustomerUpdateRequest extends BaseEntity {

    @Column(name = "mobile_number", nullable = false)
    private String mobileNumber; // Renamed from fNumber to match service

    @Column(nullable = false)
    private String cnic;

    @Column(name = "father_name", nullable = false)
    private String fatherName;

    @Column(name = "mother_name", nullable = false)
    private String motherName;

    @Column(name = "next_of_kin", nullable = false)
    private String nextOfKin; // Renamed from nextOfKinName

    @Column(nullable = false)
    private String email;

    // Optional fields from Service/DOCX
    @Column(name = "complaint_number")
    private String complaintNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_of_income")
    private SourceOfIncome sourceOfIncome;

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose_of_account")
    private PurposeOfAccount purposeOfAccount;

    private String latitude;
    private String longitude;

    @Column(name = "cc_remarks")
    private String ccRemarks;

    @Column(name = "selfie_cnic_verified")
    private boolean selfieCnicVerified;

    // File Paths (My additions)
    @Column(name = "selfie_path")
    private String selfiePath;

    @Column(name = "cnic_front_path")
    private String cnicFrontPath;

    @Column(name = "cnic_back_path")
    private String cnicBackPath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    // Workflow Fields
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by")
    private User submittedBy; // Was createdBy

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approval_comments")
    private String approvalComments;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "db_execution_result")
    private String dbExecutionResult;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "batch_id")
    private String batchId;
    
    // Alias for getCreatedBy/setCreatedBy for backward compatibility if needed, 
    // but better to update the caller. 
    // RequestService was using setCreatedBy. I should update RequestService.
}
