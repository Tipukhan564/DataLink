package com.cdup.controller;

import com.cdup.entity.AuditLog;
import com.cdup.service.AuditService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/audit")
@PreAuthorize("hasAnyRole('AUDITOR', 'ADMIN')")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<Page<AuditLog>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(auditService.getAuditLogs(
                PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<AuditLog>> searchAuditLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
        LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;

        return ResponseEntity.ok(auditService.searchAuditLogs(action, entityType, username,
                start, end, PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<Page<AuditLog>> getEntityLogs(
            @PathVariable String entityType,
            @PathVariable Long entityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(auditService.getLogsByEntity(entityType, entityId,
                PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }
}
