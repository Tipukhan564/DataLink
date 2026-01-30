package com.cdup.controller;

import com.cdup.dto.UserDTO;
import com.cdup.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

<<<<<<< HEAD
=======
    @GetMapping("/users/pending")
    public ResponseEntity<List<UserDTO>> getPendingUsers() {
        return ResponseEntity.ok(userService.getPendingUsers());
    }

    @GetMapping("/users/active")
    public ResponseEntity<List<UserDTO>> getActiveUsers() {
        return ResponseEntity.ok(userService.getActiveUsers());
    }

>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping("/users")
    public ResponseEntity<UserDTO> createUser(
            @Valid @RequestBody UserDTO userDTO,
            Authentication authentication) {
        return ResponseEntity.ok(userService.createUser(userDTO, authentication.getName()));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDTO userDTO,
            Authentication authentication) {
        return ResponseEntity.ok(userService.updateUser(id, userDTO, authentication.getName()));
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<Map<String, String>> toggleUserStatus(
            @PathVariable Long id,
            Authentication authentication) {
        userService.toggleUserStatus(id, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "User status toggled successfully"));
    }

    @PatchMapping("/users/{id}/unlock")
    public ResponseEntity<Map<String, String>> unlockUser(
            @PathVariable Long id,
            Authentication authentication) {
        userService.unlockUser(id, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "User account unlocked successfully"));
    }
}
