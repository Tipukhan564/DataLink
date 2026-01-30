package com.cdup.controller;

import com.cdup.dto.CustomerUpdateRequestDTO;
import com.cdup.entity.BulkUpload;
import com.cdup.service.BulkUploadService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
<<<<<<< HEAD
import org.springframework.data.domain.Sort;
=======
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bulk-upload")
@PreAuthorize("hasAnyRole('ENGINEER', 'ADMIN')")
public class BulkUploadController {

    private final BulkUploadService bulkUploadService;

    public BulkUploadController(BulkUploadService bulkUploadService) {
        this.bulkUploadService = bulkUploadService;
    }

    @PostMapping("/upload")
    public ResponseEntity<BulkUpload> uploadFile(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) throws Exception {
<<<<<<< HEAD
        if (!file.getOriginalFilename().endsWith(".xlsx") && !file.getOriginalFilename().endsWith(".xls")) {
=======
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || (!originalFilename.endsWith(".xlsx") && !originalFilename.endsWith(".xls"))) {
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
            throw new RuntimeException("Only Excel files (.xlsx, .xls) are accepted");
        }
        return ResponseEntity.ok(bulkUploadService.uploadFile(file, authentication.getName()));
    }

    @GetMapping("/{id}/preview")
    public ResponseEntity<List<CustomerUpdateRequestDTO>> previewUpload(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(bulkUploadService.parseExcelPreview(id));
    }

    @PostMapping("/{id}/process")
    public ResponseEntity<Map<String, String>> processUpload(
            @PathVariable Long id, Authentication authentication) {
        bulkUploadService.processBulkUpload(id, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Bulk processing started", "uploadId", id.toString()));
    }

    @GetMapping
    public ResponseEntity<Page<BulkUpload>> getAllUploads(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(bulkUploadService.getAllUploads(PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BulkUpload> getUpload(@PathVariable Long id) {
        return ResponseEntity.ok(bulkUploadService.getUploadById(id));
    }
}
