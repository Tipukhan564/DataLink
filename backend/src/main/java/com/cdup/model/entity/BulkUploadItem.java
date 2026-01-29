package com.cdup.model.entity;

import com.cdup.model.enums.RequestStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bulk_upload_items")
public class BulkUploadItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bulk_upload_id", nullable = false)
    private BulkUpload bulkUpload;

    @Column(name = "row_number")
    private Integer rowNumber;

    @Column(length = 15)
    private String cnic;

    @Column(name = "mobile_number", length = 15)
    private String mobileNumber;

    @Column(name = "next_of_kin", length = 100)
    private String nextOfKin;

    @Column(length = 100)
    private String email;

    @Column(name = "father_name", length = 100)
    private String fatherName;

    @Column(name = "mother_name", length = 100)
    private String motherName;

    @Column(name = "source_of_income", length = 50)
    private String sourceOfIncome;

    @Column(name = "purpose_of_account", length = 50)
    private String purposeOfAccount;

    @Column(length = 20)
    private String latitude;

    @Column(length = 20)
    private String longitude;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "error_message", length = 500)
    private String errorMessage;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id")
    private CustomerUpdateRequest request;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BulkUpload getBulkUpload() { return bulkUpload; }
    public void setBulkUpload(BulkUpload bulkUpload) { this.bulkUpload = bulkUpload; }

    public Integer getRowNumber() { return rowNumber; }
    public void setRowNumber(Integer rowNumber) { this.rowNumber = rowNumber; }

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

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }

    public CustomerUpdateRequest getRequest() { return request; }
    public void setRequest(CustomerUpdateRequest request) { this.request = request; }
}
