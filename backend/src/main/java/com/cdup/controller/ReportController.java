package com.cdup.controller;

import com.cdup.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/reports")
@PreAuthorize("hasAnyRole('SUPERVISOR', 'ENGINEER', 'AUDITOR', 'ADMIN')")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/daily")
    public ResponseEntity<Map<String, Object>> getDailyReport() {
        return ResponseEntity.ok(reportService.generateDailyReport());
    }

    @GetMapping("/weekly")
    public ResponseEntity<Map<String, Object>> getWeeklyReport() {
        return ResponseEntity.ok(reportService.generateWeeklyReport());
    }

    @GetMapping("/monthly")
    public ResponseEntity<Map<String, Object>> getMonthlyReport() {
        return ResponseEntity.ok(reportService.generateMonthlyReport());
    }
}
