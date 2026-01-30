package com.cdup.service;

import com.cdup.dto.CustomerUpdateRequestDTO;
import com.cdup.entity.BulkUpload;
import com.cdup.entity.User;
import com.cdup.repository.BulkUploadRepository;
import com.cdup.repository.UserRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class BulkUploadService {

    private final BulkUploadRepository bulkUploadRepository;
    private final UserRepository userRepository;
    private final CustomerUpdateService customerUpdateService;
    private final AuditService auditService;

    @Value("${app.file-storage.upload-dir:./uploads}")
    private String uploadDir;

    public BulkUploadService(BulkUploadRepository bulkUploadRepository,
                              UserRepository userRepository,
                              CustomerUpdateService customerUpdateService,
                              AuditService auditService) {
        this.bulkUploadRepository = bulkUploadRepository;
        this.userRepository = userRepository;
        this.customerUpdateService = customerUpdateService;
        this.auditService = auditService;
    }

    public BulkUpload uploadFile(MultipartFile file, String username) throws Exception {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String uniqueFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(uniqueFileName);
        file.transferTo(filePath.toFile());

        BulkUpload upload = new BulkUpload();
        upload.setFileName(uniqueFileName);
        upload.setOriginalFileName(file.getOriginalFilename());
        upload.setFilePath(filePath.toString());
        upload.setStatus("UPLOADED");
        upload.setUploadedBy(user);

        BulkUpload saved = bulkUploadRepository.save(upload);

        auditService.log("BULK_UPLOAD", "BulkUpload", saved.getId(),
                username, user.getRole().name(), null,
                "File uploaded: " + file.getOriginalFilename());

        return saved;
    }

    public List<CustomerUpdateRequestDTO> parseExcelPreview(Long uploadId) throws Exception {
        BulkUpload upload = bulkUploadRepository.findById(uploadId)
                .orElseThrow(() -> new RuntimeException("Upload not found"));

        return parseExcelFile(upload.getFilePath(), 10); // Preview first 10 rows
    }

    @Async
    public void processBulkUpload(Long uploadId, String username) {
        BulkUpload upload = bulkUploadRepository.findById(uploadId)
                .orElseThrow(() -> new RuntimeException("Upload not found"));

        upload.setStatus("PROCESSING");
        bulkUploadRepository.save(upload);

        try {
            List<CustomerUpdateRequestDTO> records = parseExcelFile(upload.getFilePath(), Integer.MAX_VALUE);
            upload.setTotalRecords(records.size());

            int success = 0;
            int failed = 0;

            for (CustomerUpdateRequestDTO dto : records) {
                try {
                    dto.setBatchId(String.valueOf(uploadId));
                    customerUpdateService.createRequest(dto, username);
                    success++;
                } catch (Exception e) {
                    failed++;
                }
                upload.setProcessedRecords(success + failed);
                upload.setSuccessfulRecords(success);
                upload.setFailedRecords(failed);
                bulkUploadRepository.save(upload);
            }

            upload.setStatus("COMPLETED");
            upload.setCompletedAt(LocalDateTime.now());
            bulkUploadRepository.save(upload);

            auditService.log("BULK_PROCESS_COMPLETE", "BulkUpload", uploadId,
                    username, "ENGINEER", null,
                    String.format("Bulk processing completed: %d total, %d success, %d failed",
                            records.size(), success, failed));

        } catch (Exception e) {
            upload.setStatus("FAILED");
            bulkUploadRepository.save(upload);

            auditService.log("BULK_PROCESS_FAILED", "BulkUpload", uploadId,
                    username, "ENGINEER", null, "Bulk processing failed: " + e.getMessage());
        }
    }

    public Page<BulkUpload> getAllUploads(Pageable pageable) {
        return bulkUploadRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public BulkUpload getUploadById(Long id) {
        return bulkUploadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Upload not found"));
    }

    private List<CustomerUpdateRequestDTO> parseExcelFile(String filePath, int maxRows) throws Exception {
        List<CustomerUpdateRequestDTO> records = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(new File(filePath));
             Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheetAt(0);
            int rowCount = 0;

            for (Row row : sheet) {
                if (rowCount == 0) { rowCount++; continue; } // Skip header
                if (rowCount > maxRows) break;

                CustomerUpdateRequestDTO dto = new CustomerUpdateRequestDTO();
                dto.setComplaintNumber(getCellValue(row.getCell(0)));
                dto.setCnic(getCellValue(row.getCell(1)));
                dto.setMobileNumber(getCellValue(row.getCell(2)));
                dto.setNextOfKin(getCellValue(row.getCell(3)));
                dto.setEmail(getCellValue(row.getCell(4)));
                dto.setFatherName(getCellValue(row.getCell(5)));
                dto.setMotherName(getCellValue(row.getCell(6)));
                dto.setSourceOfIncome(getCellValue(row.getCell(7)));
                dto.setPurposeOfAccount(getCellValue(row.getCell(8)));
                dto.setLatitude(getCellValue(row.getCell(9)));
                dto.setLongitude(getCellValue(row.getCell(10)));
                dto.setCcRemarks(getCellValue(row.getCell(11)));
                String verified = getCellValue(row.getCell(12));
                dto.setSelfieCnicVerified("YES".equalsIgnoreCase(verified));

                records.add(dto);
                rowCount++;
            }
        }

        return records;
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }
}
