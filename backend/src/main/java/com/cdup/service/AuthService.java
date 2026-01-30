package com.cdup.service;

import com.cdup.dto.AuthRequest;
import com.cdup.dto.AuthResponse;
<<<<<<< HEAD
import com.cdup.entity.User;
=======
import com.cdup.dto.SignupRequest;
import com.cdup.entity.User;
import com.cdup.enums.UserRole;
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
import com.cdup.repository.UserRepository;
import com.cdup.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
<<<<<<< HEAD
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
=======
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final AuditService auditService;
<<<<<<< HEAD
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider,
                       UserRepository userRepository, AuditService auditService,
                       org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
=======
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AuthService(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider,
                       UserRepository userRepository, AuditService auditService,
                       PasswordEncoder passwordEncoder, EmailService emailService) {
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.auditService = auditService;
        this.passwordEncoder = passwordEncoder;
<<<<<<< HEAD
=======
        this.emailService = emailService;
    }

    /**
     * Register a new user. Account will be inactive until admin approves.
     * Only @jsbl.com emails are allowed.
     */
    public Map<String, Object> signup(SignupRequest request) {
        // Validate email domain
        if (!request.getEmail().toLowerCase().endsWith("@jsbl.com")) {
            throw new RuntimeException("Only @jsbl.com email addresses are allowed for registration");
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user with inactive status (pending admin approval)
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setDepartment(request.getDepartment());
        user.setRole(UserRole.AGENT); // Default role for new signups
        user.setActive(false); // Inactive until admin approves
        user.setAccountLocked(false);
        user.setFailedAttempts(0);

        User saved = userRepository.save(user);

        auditService.log("SIGNUP", "User", saved.getId(), saved.getUsername(),
                saved.getRole().name(), null,
                "New user registration pending admin approval: " + saved.getEmail());

        // Send welcome email to user
        emailService.sendWelcomeEmail(saved.getEmail(), saved.getFullName());

        return Map.of(
                "success", true,
                "message", "Registration successful! Your account is pending admin approval. You will receive an email once your access is granted.",
                "username", saved.getUsername(),
                "email", saved.getEmail()
        );
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
    }

    public AuthResponse login(AuthRequest request) {
        try {
<<<<<<< HEAD
            Authentication authentication = authenticationManager.authenticate(
=======
            authenticationManager.authenticate(
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("User not found"));

            user.setLastLogin(LocalDateTime.now());
            user.setFailedAttempts(0);
            userRepository.save(user);

            String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name());
            String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());

            auditService.log("LOGIN", "User", user.getId(), user.getUsername(),
                    user.getRole().name(), null, "User logged in successfully");

            return new AuthResponse(token, refreshToken, user.getUsername(),
                    user.getFullName(), user.getRole().name(), user.getEmail(), user.getId());

        } catch (BadCredentialsException e) {
            userRepository.findByUsername(request.getUsername()).ifPresent(user -> {
                user.setFailedAttempts(user.getFailedAttempts() + 1);
                if (user.getFailedAttempts() >= 5) {
                    user.setAccountLocked(true);
                }
                userRepository.save(user);
            });
            throw e;
        }
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BadCredentialsException("Invalid refresh token");
        }
        String username = tokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        String newToken = tokenProvider.generateToken(user.getUsername(), user.getRole().name());
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getUsername());

        return new AuthResponse(newToken, newRefreshToken, user.getUsername(),
                user.getFullName(), user.getRole().name(), user.getEmail(), user.getId());
    }
<<<<<<< HEAD

    public AuthResponse register(com.cdup.dto.SignupRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setDepartment(request.getDepartment());
        user.setRole(com.cdup.enums.UserRole.AGENT); // Default role
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        auditService.log("REGISTER", "User", user.getId(), user.getUsername(),
                user.getRole().name(), null, "User registered successfully");

        // Auto-login
        String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());

        return new AuthResponse(token, refreshToken, user.getUsername(),
                user.getFullName(), user.getRole().name(), user.getEmail(), user.getId());
    }
=======
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
}
