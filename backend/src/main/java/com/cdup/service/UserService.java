package com.cdup.service;

import com.cdup.dto.UserDTO;
import com.cdup.entity.User;
import com.cdup.enums.UserRole;
import com.cdup.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuditService auditService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    @Transactional
    public UserDTO createUser(UserDTO dto, String adminUsername) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setDepartment(dto.getDepartment());
        user.setRole(UserRole.valueOf(dto.getRole()));
        user.setActive(true);

        User saved = userRepository.save(user);

        auditService.log("CREATE_USER", "User", saved.getId(), adminUsername,
                "ADMIN", null, "User created: " + saved.getUsername() + " with role " + saved.getRole());

        return mapToDTO(saved);
    }

    @Transactional
    public UserDTO updateUser(Long id, UserDTO dto, String adminUsername) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setDepartment(dto.getDepartment());
        user.setRole(UserRole.valueOf(dto.getRole()));
        user.setActive(dto.isActive());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        User saved = userRepository.save(user);

        auditService.log("UPDATE_USER", "User", saved.getId(), adminUsername,
                "ADMIN", null, "User updated: " + saved.getUsername());

        return mapToDTO(saved);
    }

    @Transactional
    public void toggleUserStatus(Long id, String adminUsername) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!user.isActive());
        userRepository.save(user);

        auditService.log("TOGGLE_USER_STATUS", "User", id, adminUsername,
                "ADMIN", null, "User " + user.getUsername() + " status set to " + user.isActive());
    }

    @Transactional
    public void unlockUser(Long id, String adminUsername) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAccountLocked(false);
        user.setFailedAttempts(0);
        userRepository.save(user);

        auditService.log("UNLOCK_USER", "User", id, adminUsername,
                "ADMIN", null, "User account unlocked: " + user.getUsername());
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        return userRepository.findById(id).map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserDTO getUserByUsername(String username) {
        return userRepository.findByUsername(username).map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setDepartment(user.getDepartment());
        dto.setRole(user.getRole().name());
        dto.setActive(user.isActive());
        if (user.getCreatedAt() != null) dto.setCreatedAt(user.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        if (user.getLastLogin() != null) dto.setLastLogin(user.getLastLogin().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        return dto;
    }
}
