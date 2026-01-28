package com.cdup.controller;

import com.cdup.dto.ApprovalActionDTO;
import com.cdup.dto.CustomerUpdateRequestDTO;
import com.cdup.enums.RequestStatus;
import com.cdup.service.CustomerUpdateService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/approvals")
@PreAuthorize("hasAnyRole('SUPERVISOR', 'ENGINEER', 'ADMIN')")
public class ApprovalController {

    private final CustomerUpdateService updateService;

    public ApprovalController(CustomerUpdateService updateService) {
        this.updateService = updateService;
    }

    @GetMapping("/pending")
    public ResponseEntity<Page<CustomerUpdateRequestDTO>> getPendingRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(updateService.getRequestsByStatus(
                RequestStatus.PENDING, PageRequest.of(page, size, Sort.by("createdAt").ascending())));
    }

    @PostMapping("/action")
    public ResponseEntity<CustomerUpdateRequestDTO> processApprovalAction(
            @Valid @RequestBody ApprovalActionDTO actionDTO,
            Authentication authentication) {
        if ("APPROVE".equalsIgnoreCase(actionDTO.getAction())) {
            return ResponseEntity.ok(updateService.approveRequest(
                    actionDTO.getRequestId(), authentication.getName(), actionDTO.getComments()));
        } else if ("REJECT".equalsIgnoreCase(actionDTO.getAction())) {
            return ResponseEntity.ok(updateService.rejectRequest(
                    actionDTO.getRequestId(), authentication.getName(), actionDTO.getComments()));
        }
        throw new RuntimeException("Invalid action. Use APPROVE or REJECT.");
    }
}
