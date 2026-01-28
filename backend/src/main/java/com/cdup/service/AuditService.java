package com.cdup.service;

import com.cdup.entity.AuditLog;
import com.cdup.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(String action, String entityType, Long entityId,
                    String username, String userRole, String ipAddress, String description) {
        AuditLog log = new AuditLog(action, entityType, entityId, null, username, userRole, ipAddress, description);
        auditLogRepository.save(log);
    }

    public void logWithValues(String action, String entityType, Long entityId,
                               String username, String userRole, String ipAddress,
                               String description, String oldValues, String newValues) {
        AuditLog log = new AuditLog(action, entityType, entityId, null, username, userRole, ipAddress, description);
        log.setOldValues(oldValues);
        log.setNewValues(newValues);
        auditLogRepository.save(log);
    }

    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAll(pageable);
    }

    public Page<AuditLog> searchAuditLogs(String action, String entityType,
                                           String username, LocalDateTime startDate,
                                           LocalDateTime endDate, Pageable pageable) {
        return auditLogRepository.searchAuditLogs(action, entityType, username, startDate, endDate, pageable);
    }

    public Page<AuditLog> getLogsByEntity(String entityType, Long entityId, Pageable pageable) {
        return auditLogRepository.findByEntityTypeAndEntityId(entityType, entityId, pageable);
    }
}
