package com.cdup.controller;

import com.cdup.dto.AuthRequest;
import com.cdup.dto.AuthResponse;
<<<<<<< HEAD
=======
import com.cdup.dto.SignupRequest;
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
import com.cdup.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

<<<<<<< HEAD
=======
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }
<<<<<<< HEAD

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody com.cdup.dto.SignupRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
=======
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
}
