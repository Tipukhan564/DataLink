package com.cdup.repository;

import com.cdup.entity.User;
import com.cdup.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findByRole(UserRole role);
    List<User> findByActiveTrue();
<<<<<<< HEAD
=======
    List<User> findByIsActive(boolean isActive);
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
    List<User> findByDepartment(String department);
}
