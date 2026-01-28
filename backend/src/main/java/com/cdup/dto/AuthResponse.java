package com.cdup.dto;

public class AuthResponse {
    private String token;
    private String refreshToken;
    private String username;
    private String fullName;
    private String role;
    private String email;
    private Long userId;

    public AuthResponse() {}

    public AuthResponse(String token, String refreshToken, String username,
                        String fullName, String role, String email, Long userId) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.email = email;
        this.userId = userId;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
