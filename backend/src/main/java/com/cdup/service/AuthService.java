package com.cdup.service;

import com.cdup.dto.AuthRequest;
import com.cdup.dto.AuthResponse;
import com.cdup.entity.User;
import com.cdup.repository.UserRepository;
import com.cdup.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public AuthService(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider,
                       UserRepository userRepository, AuditService auditService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    public AuthResponse login(AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
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
}
