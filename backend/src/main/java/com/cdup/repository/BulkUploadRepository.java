package com.cdup.repository;

import com.cdup.entity.BulkUpload;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BulkUploadRepository extends JpaRepository<BulkUpload, Long> {
    Page<BulkUpload> findByUploadedById(Long userId, Pageable pageable);
    Page<BulkUpload> findByStatus(String status, Pageable pageable);
    Page<BulkUpload> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
