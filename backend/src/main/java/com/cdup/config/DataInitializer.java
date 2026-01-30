package com.cdup.config;

import com.cdup.entity.User;
import com.cdup.enums.UserRole;
import com.cdup.repository.UserRepository;
<<<<<<< HEAD
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
=======
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(new User("admin", passwordEncoder.encode("Admin@123"),
                        "System Administrator", "admin@cdup.com", UserRole.ADMIN));
                userRepository.save(new User("supervisor1", passwordEncoder.encode("Super@123"),
                        "John Supervisor", "supervisor1@cdup.com", UserRole.SUPERVISOR));
                userRepository.save(new User("agent1", passwordEncoder.encode("Agent@123"),
                        "Sarah Agent", "agent1@cdup.com", UserRole.AGENT));
                userRepository.save(new User("engineer1", passwordEncoder.encode("Eng@123"),
                        "Mike Engineer", "engineer1@cdup.com", UserRole.ENGINEER));
                userRepository.save(new User("auditor1", passwordEncoder.encode("Audit@123"),
                        "Lisa Auditor", "auditor1@cdup.com", UserRole.AUDITOR));

                System.out.println("=== Default users created ===");
                System.out.println("Admin: admin / Admin@123");
                System.out.println("Supervisor: supervisor1 / Super@123");
                System.out.println("Agent: agent1 / Agent@123");
                System.out.println("Engineer: engineer1 / Eng@123");
                System.out.println("Auditor: auditor1 / Audit@123");
            }
        };
    }
}
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
