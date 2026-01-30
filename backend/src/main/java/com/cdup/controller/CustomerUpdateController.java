package com.cdup.controller;

<<<<<<< HEAD
import com.cdup.dto.CustomerUpdateDTO;
=======
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
import com.cdup.dto.CustomerUpdateRequestDTO;
import com.cdup.dto.DashboardStatsDTO;
import com.cdup.enums.RequestStatus;
import com.cdup.service.CustomerUpdateService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/requests")
<<<<<<< HEAD
@CrossOrigin(origins = "*", maxAge = 3600)
=======
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
public class CustomerUpdateController {

    private final CustomerUpdateService updateService;

    public CustomerUpdateController(CustomerUpdateService updateService) {
        this.updateService = updateService;
    }

<<<<<<< HEAD
    /**
     * Create a new customer update request (accepts JSON, no file uploads)
     */
    @PostMapping
    public ResponseEntity<CustomerUpdateRequestDTO> createRequest(
            @Valid @RequestBody CustomerUpdateDTO dto,
=======
    @PostMapping
    public ResponseEntity<CustomerUpdateRequestDTO> createRequest(
            @Valid @RequestBody CustomerUpdateRequestDTO dto,
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
            Authentication authentication) {
        return ResponseEntity.ok(updateService.createRequest(dto, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<Page<CustomerUpdateRequestDTO>> getAllRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        return ResponseEntity.ok(updateService.getAllRequests(PageRequest.of(page, size, sort)));
    }

    @GetMapping("/my")
    public ResponseEntity<Page<CustomerUpdateRequestDTO>> getMyRequests(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(updateService.getRequestsByUser(
                authentication.getName(), PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerUpdateRequestDTO> getRequest(@PathVariable Long id) {
        return ResponseEntity.ok(updateService.getRequestById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<CustomerUpdateRequestDTO>> getByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(updateService.getRequestsByStatus(
                RequestStatus.valueOf(status.toUpperCase()),
                PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<CustomerUpdateRequestDTO>> searchRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String cnic,
            @RequestParam(required = false) String mobile,
            @RequestParam(required = false) String complaintNumber,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        RequestStatus statusEnum = status != null ? RequestStatus.valueOf(status.toUpperCase()) : null;
        LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
        LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;

        return ResponseEntity.ok(updateService.searchRequests(statusEnum, cnic, mobile, complaintNumber,
                start, end, PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(updateService.getDashboardStats());
    }

    @PostMapping("/{id}/process")
    public ResponseEntity<CustomerUpdateRequestDTO> processRequest(
            @PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(updateService.processRequest(id, authentication.getName()));
    }
<<<<<<< HEAD
    
    /**
     * Approve a request
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<CustomerUpdateRequestDTO> approveRequest(
            @PathVariable Long id,
            @RequestParam(required = false) String comments,
            Authentication authentication) {
        return ResponseEntity.ok(updateService.approveRequest(id, authentication.getName(), comments));
    }
    
    /**
     * Reject a request
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<CustomerUpdateRequestDTO> rejectRequest(
            @PathVariable Long id,
            @RequestParam(required = false) String comments,
            Authentication authentication) {
        return ResponseEntity.ok(updateService.rejectRequest(id, authentication.getName(), comments));
    }
}
=======
}
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
