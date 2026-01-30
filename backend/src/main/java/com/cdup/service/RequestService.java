package com.cdup.service;

import com.cdup.dto.CustomerUpdateDTO;
import com.cdup.entity.CustomerUpdateRequest;
import com.cdup.entity.User;
import com.cdup.enums.RequestStatus;
import com.cdup.repository.RequestRepository;
import com.cdup.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RequestService {

    private static final Logger log = LoggerFactory.getLogger(RequestService.class);

    private final RequestRepository requestRepository;
    // REMOVED: private final FileStorageService fileStorageService;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public RequestService(RequestRepository requestRepository,
                          UserRepository userRepository, 
                          AuditService auditService) {
        this.requestRepository = requestRepository;
        // REMOVED: this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Transactional
    public CustomerUpdateRequest createRequest(CustomerUpdateDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        CustomerUpdateRequest request = new CustomerUpdateRequest();
        
        // FIXED: Changed from getFNumber() to getMobileNumber()
        request.setMobileNumber(dto.getMobileNumber());
        request.setCnic(dto.getCnic());
        request.setFatherName(dto.getFatherName());
        request.setMotherName(dto.getMotherName());
        
        // FIXED: Changed from getNextOfKinName() to getNextOfKin()
        request.setNextOfKin(dto.getNextOfKin());
        request.setEmail(dto.getEmail());
        
        // Optional Fields
        request.setComplaintNumber(dto.getComplaintNumber());
        
        // Parse Source of Income enum (handle spaces and case-insensitive)
        if (dto.getSourceOfIncome() != null && !dto.getSourceOfIncome().isEmpty()) {
            try {
                String enumValue = dto.getSourceOfIncome().toUpperCase().replace(" ", "_");
                request.setSourceOfIncome(com.cdup.enums.SourceOfIncome.valueOf(enumValue));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid source of income value: {}", dto.getSourceOfIncome());
                // Set to OTHER as fallback
                request.setSourceOfIncome(com.cdup.enums.SourceOfIncome.OTHER);
            }
        }
        
        // Parse Purpose of Account enum (handle spaces and case-insensitive)
        if (dto.getPurposeOfAccount() != null && !dto.getPurposeOfAccount().isEmpty()) {
            try {
                String enumValue = dto.getPurposeOfAccount().toUpperCase().replace(" ", "_");
                request.setPurposeOfAccount(com.cdup.enums.PurposeOfAccount.valueOf(enumValue));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid purpose of account value: {}", dto.getPurposeOfAccount());
                // Set to OTHER as fallback
                request.setPurposeOfAccount(com.cdup.enums.PurposeOfAccount.OTHER);
            }
        }
        
        // Set coordinates with defaults if not provided
        request.setLatitude(dto.getLatitude() != null && !dto.getLatitude().isEmpty() 
                ? dto.getLatitude() : "31.4592209");
        request.setLongitude(dto.getLongitude() != null && !dto.getLongitude().isEmpty() 
                ? dto.getLongitude() : "74.2762544");
        
        request.setCcRemarks(dto.getCcRemarks());
        request.setSelfieCnicVerified(dto.getSelfieCnicVerified() != null ? dto.getSelfieCnicVerified() : false);

        request.setStatus(RequestStatus.PENDING);
        request.setSubmittedBy(currentUser);

        // REMOVED: All file storage logic
        // No longer storing files since we removed file upload functionality
        /*
        if (dto.getSelfie() != null && !dto.getSelfie().isEmpty()) {
            request.setSelfiePath(fileStorageService.storeFile(dto.getSelfie()));
        }
        if (dto.getCnicFront() != null && !dto.getCnicFront().isEmpty()) {
            request.setCnicFrontPath(fileStorageService.storeFile(dto.getCnicFront()));
        }
        if (dto.getCnicBack() != null && !dto.getCnicBack().isEmpty()) {
            request.setCnicBackPath(fileStorageService.storeFile(dto.getCnicBack()));
        }
        */

        CustomerUpdateRequest savedRequest = requestRepository.save(request);
        
        auditService.log("CREATE_REQUEST", "CustomerUpdateRequest", savedRequest.getId(), username,
                currentUser.getRole().name(), null, 
                String.format("Created update request for CNIC: %s, Mobile: %s", 
                        dto.getCnic(), dto.getMobileNumber()));

        log.info("Customer update request created successfully - ID: {}, CNIC: {}, User: {}", 
                savedRequest.getId(), dto.getCnic(), username);

        return savedRequest;
    }
}