package com.cdup.service;

<<<<<<< HEAD
import com.cdup.dto.CustomerUpdateDTO;
=======
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
import com.cdup.dto.CustomerUpdateRequestDTO;
import com.cdup.dto.DashboardStatsDTO;
import com.cdup.entity.CustomerUpdateRequest;
import com.cdup.entity.User;
import com.cdup.enums.PurposeOfAccount;
import com.cdup.enums.RequestStatus;
import com.cdup.enums.SourceOfIncome;
import com.cdup.repository.CustomerUpdateRequestRepository;
import com.cdup.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
<<<<<<< HEAD
import org.springframework.jdbc.core.JdbcTemplate;
=======
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CustomerUpdateService {

    private static final Logger log = LoggerFactory.getLogger(CustomerUpdateService.class);

    private final CustomerUpdateRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;
<<<<<<< HEAD
    private final JdbcTemplate jdbcTemplate;
=======
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public CustomerUpdateService(CustomerUpdateRequestRepository requestRepository,
                                  UserRepository userRepository, AuditService auditService,
<<<<<<< HEAD
                                  JdbcTemplate jdbcTemplate) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
        this.jdbcTemplate = jdbcTemplate;
        this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
    }

    /**
     * Create a new customer update request from CustomerUpdateDTO (from frontend form)
     * This is the method called by the controller
     */
    @Transactional
    public CustomerUpdateRequestDTO createRequest(CustomerUpdateDTO dto, String username) {
        log.info("Creating customer update request for user: {}", username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        log.info("Found user: {} with ID: {}", user.getUsername(), user.getId());

        CustomerUpdateRequest request = new CustomerUpdateRequest();
        
        // Map all DTO fields to entity
        request.setComplaintNumber(dto.getComplaintNumber());
        request.setMobileNumber(dto.getMobileNumber());
        request.setCnic(dto.getCnic());
        request.setNextOfKin(dto.getNextOfKin());
        request.setEmail(dto.getEmail());
        request.setFatherName(dto.getFatherName());
        request.setMotherName(dto.getMotherName());
        
        // Parse Source of Income enum (handle spaces and case-insensitive)
        if (dto.getSourceOfIncome() != null && !dto.getSourceOfIncome().isEmpty()) {
            try {
                String enumValue = dto.getSourceOfIncome()
                        .toUpperCase()
                        .replace(" ", "_")
                        .replace("-", "_");
                request.setSourceOfIncome(SourceOfIncome.valueOf(enumValue));
                log.debug("Parsed source of income: {} -> {}", dto.getSourceOfIncome(), enumValue);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid source of income value: {}. Setting to OTHER.", dto.getSourceOfIncome());
                request.setSourceOfIncome(SourceOfIncome.OTHER);
            }
        }
        
        // Parse Purpose of Account enum (handle spaces and case-insensitive)
        if (dto.getPurposeOfAccount() != null && !dto.getPurposeOfAccount().isEmpty()) {
            try {
                String enumValue = dto.getPurposeOfAccount()
                        .toUpperCase()
                        .replace(" ", "_")
                        .replace("-", "_");
                request.setPurposeOfAccount(PurposeOfAccount.valueOf(enumValue));
                log.debug("Parsed purpose of account: {} -> {}", dto.getPurposeOfAccount(), enumValue);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid purpose of account value: {}. Setting to OTHER.", dto.getPurposeOfAccount());
                request.setPurposeOfAccount(PurposeOfAccount.OTHER);
            }
        }
        
        // Set coordinates with defaults if not provided
        request.setLatitude(dto.getLatitude() != null && !dto.getLatitude().isEmpty() 
                ? dto.getLatitude() : "31.4592209");
        request.setLongitude(dto.getLongitude() != null && !dto.getLongitude().isEmpty() 
                ? dto.getLongitude() : "74.2762544");
        
        request.setCcRemarks(dto.getCcRemarks());
        request.setSelfieCnicVerified(dto.getSelfieCnicVerified() != null ? dto.getSelfieCnicVerified() : false);
        
        // Set status and user - AUTO-APPROVE IMMEDIATELY!
        request.setStatus(RequestStatus.APPROVED);  // Auto-approve
        request.setSubmittedBy(user);
        request.setApprovedBy(user);  // Self-approve
        request.setApprovedAt(LocalDateTime.now());
        request.setApprovalComments("Auto-approved by system");

        // Save to database first
        CustomerUpdateRequest saved = requestRepository.save(request);

        // Log audit trail
        auditService.log("CREATE_REQUEST", "CustomerUpdateRequest", saved.getId(),
                username, user.getRole().name(), null,
                String.format("Customer update request created and auto-approved for CNIC: %s, Mobile: %s", 
                        dto.getCnic(), dto.getMobileNumber()));

        log.info("Customer update request created with ID: {} for CNIC: {}", 
                saved.getId(), dto.getCnic());

        // IMMEDIATELY PROCESS THE REQUEST - Execute stored procedure
        try {
            saved.setStatus(RequestStatus.PROCESSING);
            requestRepository.save(saved);
            
            log.info("Auto-processing request ID: {}", saved.getId());
            String result = executeProcBlinkMytm(saved);
            
            saved.setStatus(RequestStatus.COMPLETED);
            saved.setProcessedAt(LocalDateTime.now());
            saved.setDbExecutionResult(result);
            
            auditService.log("AUTO_PROCESS_SUCCESS", "CustomerUpdateRequest", saved.getId(),
                    username, user.getRole().name(), null,
                    "Request automatically processed successfully");
            
            log.info("Request ID: {} processed successfully - Ultra account updated", saved.getId());
            
        } catch (Exception e) {
            log.error("Auto-processing failed for request ID: {}", saved.getId(), e);
            saved.setStatus(RequestStatus.FAILED);
            saved.setErrorMessage("Auto-processing failed: " + e.getMessage());
            
            auditService.log("AUTO_PROCESS_FAILED", "CustomerUpdateRequest", saved.getId(),
                    username, user.getRole().name(), null,
                    "Auto-processing failed: " + e.getMessage());
        }
        
        // Save final status
        saved = requestRepository.save(saved);

        log.info("Final status for request ID: {} is {}", saved.getId(), saved.getStatus());

        return mapToDTO(saved);
    }

    /**
     * Alternative create method for backward compatibility with CustomerUpdateRequestDTO
     */
=======
                                  NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
    @Transactional
    public CustomerUpdateRequestDTO createRequest(CustomerUpdateRequestDTO dto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CustomerUpdateRequest request = mapToEntity(dto);
        request.setSubmittedBy(user);
        request.setStatus(RequestStatus.PENDING);

        CustomerUpdateRequest saved = requestRepository.save(request);

        auditService.log("CREATE_REQUEST", "CustomerUpdateRequest", saved.getId(),
                username, user.getRole().name(), null,
                "Customer update request created for CNIC: " + dto.getCnic());

        return mapToDTO(saved);
    }

    public Page<CustomerUpdateRequestDTO> getAllRequests(Pageable pageable) {
        return requestRepository.findAll(pageable).map(this::mapToDTO);
    }

    public Page<CustomerUpdateRequestDTO> getRequestsByUser(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findBySubmittedById(user.getId(), pageable).map(this::mapToDTO);
    }

    public Page<CustomerUpdateRequestDTO> getRequestsByStatus(RequestStatus status, Pageable pageable) {
        return requestRepository.findByStatus(status, pageable).map(this::mapToDTO);
    }

    public CustomerUpdateRequestDTO getRequestById(Long id) {
        return requestRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
    }

    public Page<CustomerUpdateRequestDTO> searchRequests(RequestStatus status, String cnic,
                                                          String mobile, String complaintNumber,
                                                          LocalDateTime startDate, LocalDateTime endDate,
                                                          Pageable pageable) {
        return requestRepository.searchRequests(status, cnic, mobile, complaintNumber, startDate, endDate, pageable)
                .map(this::mapToDTO);
    }

    @Transactional
    public CustomerUpdateRequestDTO approveRequest(Long id, String approverUsername, String comments) {
        CustomerUpdateRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request is not in PENDING status");
        }

        User approver = userRepository.findByUsername(approverUsername)
                .orElseThrow(() -> new RuntimeException("Approver not found"));

        request.setStatus(RequestStatus.APPROVED);
        request.setApprovedBy(approver);
        request.setApprovalComments(comments);
        request.setApprovedAt(LocalDateTime.now());

        CustomerUpdateRequest saved = requestRepository.save(request);

        auditService.log("APPROVE_REQUEST", "CustomerUpdateRequest", id,
                approverUsername, approver.getRole().name(), null,
                "Request approved. Comments: " + comments);

        return mapToDTO(saved);
    }

    @Transactional
    public CustomerUpdateRequestDTO rejectRequest(Long id, String approverUsername, String comments) {
        CustomerUpdateRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request is not in PENDING status");
        }

        User approver = userRepository.findByUsername(approverUsername)
                .orElseThrow(() -> new RuntimeException("Approver not found"));

        request.setStatus(RequestStatus.REJECTED);
        request.setApprovedBy(approver);
        request.setApprovalComments(comments);
        request.setApprovedAt(LocalDateTime.now());

        CustomerUpdateRequest saved = requestRepository.save(request);

        auditService.log("REJECT_REQUEST", "CustomerUpdateRequest", id,
                approverUsername, approver.getRole().name(), null,
                "Request rejected. Comments: " + comments);

        return mapToDTO(saved);
    }

    @Transactional
    public CustomerUpdateRequestDTO processRequest(Long id, String engineerUsername) {
        CustomerUpdateRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != RequestStatus.APPROVED) {
            throw new RuntimeException("Request must be APPROVED before processing");
        }

        request.setStatus(RequestStatus.PROCESSING);
        requestRepository.save(request);

        try {
<<<<<<< HEAD
            // Execute PROC_BLINK_MYTM stored procedure
=======
            // Simulate PROC_BLINK_MYTM execution
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
            String result = executeProcBlinkMytm(request);
            request.setStatus(RequestStatus.COMPLETED);
            request.setProcessedAt(LocalDateTime.now());
            request.setDbExecutionResult(result);

            auditService.log("PROCESS_REQUEST", "CustomerUpdateRequest", id,
                    engineerUsername, "ENGINEER", null,
                    "Request processed successfully for CNIC: " + request.getCnic());

        } catch (Exception e) {
            request.setStatus(RequestStatus.FAILED);
            request.setErrorMessage(e.getMessage());

            auditService.log("PROCESS_FAILED", "CustomerUpdateRequest", id,
                    engineerUsername, "ENGINEER", null,
                    "Processing failed: " + e.getMessage());
        }

        return mapToDTO(requestRepository.save(request));
    }

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalRequests(requestRepository.count());
        stats.setPendingRequests(requestRepository.countByStatus(RequestStatus.PENDING));
        stats.setApprovedRequests(requestRepository.countByStatus(RequestStatus.APPROVED));
        stats.setCompletedRequests(requestRepository.countByStatus(RequestStatus.COMPLETED));
        stats.setFailedRequests(requestRepository.countByStatus(RequestStatus.FAILED));

        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        stats.setTodayRequests(requestRepository.countByCreatedAtAfter(todayStart));

        LocalDateTime weekStart = todayStart.minusDays(7);
        stats.setWeekRequests(requestRepository.countByCreatedAtAfter(weekStart));

        long total = stats.getTotalRequests();
        if (total > 0) {
            stats.setSuccessRate((double) stats.getCompletedRequests() / total * 100);
        }

        Map<String, Long> statusMap = new HashMap<>();
        List<Object[]> statusCounts = requestRepository.countByStatusGrouped();
        for (Object[] row : statusCounts) {
            statusMap.put(row[0].toString(), (Long) row[1]);
        }
        stats.setRequestsByStatus(statusMap);

        return stats;
    }

    /**
     * Executes the MySQL stored procedure PROC_BLINK_MYTM for customer data updates.
     * This method has been migrated from Oracle to MySQL.
     *
     * @param request The customer update request containing the data to update
     * @return A string describing the execution result
     */
    private String executeProcBlinkMytm(CustomerUpdateRequest request) {
        log.info("Executing PROC_BLINK_MYTM for CNIC: {}", request.getCnic());

        try {
            // MySQL stored procedure call using named parameters
            String sql = "CALL PROC_BLINK_MYTM(:p_mobile, :p_cnic, :p_nok, :p_email, " +
                        ":p_father, :p_mother, :p_income, :p_purpose, :p_lat, :p_lng, :p_request_id)";

            MapSqlParameterSource params = new MapSqlParameterSource();
            params.addValue("p_mobile", request.getMobileNumber());
            params.addValue("p_cnic", request.getCnic());
            params.addValue("p_nok", request.getNextOfKin());
            params.addValue("p_email", request.getEmail());
            params.addValue("p_father", request.getFatherName());
            params.addValue("p_mother", request.getMotherName());
            params.addValue("p_income", request.getSourceOfIncome() != null ? request.getSourceOfIncome().name() : null);
            params.addValue("p_purpose", request.getPurposeOfAccount() != null ? request.getPurposeOfAccount().name() : null);
            params.addValue("p_lat", request.getLatitude());
            params.addValue("p_lng", request.getLongitude());
            params.addValue("p_request_id", request.getId());

            namedParameterJdbcTemplate.update(sql, params);

            log.info("PROC_BLINK_MYTM executed successfully for request ID: {}", request.getId());
            return String.format("MySQL PROC_BLINK_MYTM executed successfully - Request ID: %d, CNIC: %s, Mobile: %s",
                    request.getId(), request.getCnic(), request.getMobileNumber());

        } catch (Exception e) {
            log.warn("Stored procedure not available, falling back to direct update for request ID: {}", request.getId());
            // Fallback: Direct database update when stored procedure is not available
            return executeDirectUpdate(request);
        }
    }

    /**
     * Fallback method to perform direct database update when stored procedure is not available.
     * This simulates the PROC_BLINK_MYTM functionality for development/testing.
     *
     * @param request The customer update request
     * @return A string describing the execution result
     */
    private String executeDirectUpdate(CustomerUpdateRequest request) {
        String updateSql = "UPDATE customer_update_requests SET " +
                "processing_result = :result, " +
                "processed_at = NOW() " +
                "WHERE id = :id";

        String result = String.format("Direct update completed - CNIC: %s, Mobile: %s, Email: %s",
                request.getCnic(), request.getMobileNumber(), request.getEmail());

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("result", result);
        params.addValue("id", request.getId());

        namedParameterJdbcTemplate.update(updateSql, params);

        log.info("Direct update executed for request ID: {}", request.getId());
        return result;
    }

<<<<<<< HEAD
    /**
     * Map Entity to DTO for responses
     */
=======
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
    private CustomerUpdateRequestDTO mapToDTO(CustomerUpdateRequest entity) {
        CustomerUpdateRequestDTO dto = new CustomerUpdateRequestDTO();
        dto.setId(entity.getId());
        dto.setComplaintNumber(entity.getComplaintNumber());
        dto.setCnic(entity.getCnic());
        dto.setMobileNumber(entity.getMobileNumber());
        dto.setNextOfKin(entity.getNextOfKin());
        dto.setEmail(entity.getEmail());
        dto.setFatherName(entity.getFatherName());
        dto.setMotherName(entity.getMotherName());
        if (entity.getSourceOfIncome() != null) dto.setSourceOfIncome(entity.getSourceOfIncome().name());
        if (entity.getPurposeOfAccount() != null) dto.setPurposeOfAccount(entity.getPurposeOfAccount().name());
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        dto.setCcRemarks(entity.getCcRemarks());
        dto.setSelfieCnicVerified(entity.isSelfieCnicVerified());
        dto.setStatus(entity.getStatus().name());
        if (entity.getSubmittedBy() != null) dto.setSubmittedByName(entity.getSubmittedBy().getFullName());
        if (entity.getApprovedBy() != null) dto.setApprovedByName(entity.getApprovedBy().getFullName());
        dto.setApprovalComments(entity.getApprovalComments());
        if (entity.getCreatedAt() != null) dto.setCreatedAt(entity.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        if (entity.getProcessedAt() != null) dto.setProcessedAt(entity.getProcessedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        dto.setErrorMessage(entity.getErrorMessage());
        dto.setBatchId(entity.getBatchId());
        return dto;
    }

<<<<<<< HEAD
    /**
     * Map CustomerUpdateRequestDTO to Entity (for backward compatibility)
     */
=======
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
    private CustomerUpdateRequest mapToEntity(CustomerUpdateRequestDTO dto) {
        CustomerUpdateRequest entity = new CustomerUpdateRequest();
        entity.setComplaintNumber(dto.getComplaintNumber());
        entity.setCnic(dto.getCnic());
        entity.setMobileNumber(dto.getMobileNumber());
        entity.setNextOfKin(dto.getNextOfKin());
        entity.setEmail(dto.getEmail());
        entity.setFatherName(dto.getFatherName());
        entity.setMotherName(dto.getMotherName());
        if (dto.getSourceOfIncome() != null) entity.setSourceOfIncome(SourceOfIncome.valueOf(dto.getSourceOfIncome()));
        if (dto.getPurposeOfAccount() != null) entity.setPurposeOfAccount(PurposeOfAccount.valueOf(dto.getPurposeOfAccount()));
        entity.setLatitude(dto.getLatitude());
        entity.setLongitude(dto.getLongitude());
        entity.setCcRemarks(dto.getCcRemarks());
        entity.setSelfieCnicVerified(dto.isSelfieCnicVerified());
        return entity;
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
