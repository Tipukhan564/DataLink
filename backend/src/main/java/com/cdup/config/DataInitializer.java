package com.cdup.config;

import com.cdup.entity.User;
import com.cdup.enums.UserRole;
import com.cdup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Data initializer that creates a default admin user on application startup
 * This runs automatically when the application starts
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createDefaultAdminUser();
    }

    private void createDefaultAdminUser() {
        String adminEmail = "admin@cdup.com";
        
        try {
            // Check if admin user already exists
            if (userRepository.existsByEmail(adminEmail)) {
                log.info("Admin user already exists");
                return;
            }

            // Create new admin user
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("Admin@123")); // Hardcoded password
            admin.setFullName("Admin User");
            admin.setEmail(adminEmail);
            admin.setPhone("+923001234567");
            admin.setDepartment("IT");
            admin.setRole(UserRole.ADMIN);
            admin.setActive(true);
            admin.setFailedAttempts(0);
            admin.setAccountLocked(false);
            
            userRepository.save(admin);
            
            log.info("========================================");
            log.info("Default Admin User Created Successfully!");
            log.info("Username: admin");
            log.info("Email: admin@cdup.com");
            log.info("Password: Admin@123");
            log.info("Role: ADMIN");
            log.info("IMPORTANT: Change this password after first login!");
            log.info("========================================");
            
        } catch (Exception e) {
            log.error("Error creating default admin user: {}", e.getMessage());
        }
    }
}