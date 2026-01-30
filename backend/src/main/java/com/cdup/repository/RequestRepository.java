package com.cdup.repository;

import com.cdup.entity.CustomerUpdateRequest;
import com.cdup.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<CustomerUpdateRequest, Long> {
    Page<CustomerUpdateRequest> findByStatus(RequestStatus status, Pageable pageable);
    Page<CustomerUpdateRequest> findBySubmittedById(Long userId, Pageable pageable);
}
