package com.cdup.repository;

import com.cdup.entity.CustomerUpdateRequest;
import com.cdup.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CustomerUpdateRequestRepository extends JpaRepository<CustomerUpdateRequest, Long> {

    Page<CustomerUpdateRequest> findByStatus(RequestStatus status, Pageable pageable);

    Page<CustomerUpdateRequest> findBySubmittedById(Long userId, Pageable pageable);

<<<<<<< HEAD
    List<CustomerUpdateRequest> findByBatchId(String batchId);
=======
    List<CustomerUpdateRequest> findByBatchId(Long batchId);
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56

    Page<CustomerUpdateRequest> findByCnicContaining(String cnic, Pageable pageable);

    Page<CustomerUpdateRequest> findByMobileNumberContaining(String mobileNumber, Pageable pageable);

    Page<CustomerUpdateRequest> findByComplaintNumberContaining(String complaintNumber, Pageable pageable);

    long countByStatus(RequestStatus status);

    long countByCreatedAtAfter(LocalDateTime date);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT r.status, COUNT(r) FROM CustomerUpdateRequest r GROUP BY r.status")
    List<Object[]> countByStatusGrouped();

    @Query("SELECT FUNCTION('DATE', r.createdAt), COUNT(r) FROM CustomerUpdateRequest r " +
           "WHERE r.createdAt >= :startDate GROUP BY FUNCTION('DATE', r.createdAt) ORDER BY FUNCTION('DATE', r.createdAt)")
    List<Object[]> countByDayAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT r FROM CustomerUpdateRequest r WHERE " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:cnic IS NULL OR r.cnic LIKE %:cnic%) AND " +
           "(:mobile IS NULL OR r.mobileNumber LIKE %:mobile%) AND " +
           "(:complaintNumber IS NULL OR r.complaintNumber LIKE %:complaintNumber%) AND " +
           "(:startDate IS NULL OR r.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR r.createdAt <= :endDate)")
    Page<CustomerUpdateRequest> searchRequests(
            @Param("status") RequestStatus status,
            @Param("cnic") String cnic,
            @Param("mobile") String mobile,
            @Param("complaintNumber") String complaintNumber,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);
<<<<<<< HEAD
}
=======
}
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
