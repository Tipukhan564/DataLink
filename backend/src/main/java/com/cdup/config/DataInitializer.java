package com.cdup.config;

import com.cdup.entity.User;
import com.cdup.enums.UserRole;
import com.cdup.repository.UserRepository;
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
