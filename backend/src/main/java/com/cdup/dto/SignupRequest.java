package com.cdup.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
<<<<<<< HEAD
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {
=======
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SignupRequest {

>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Password is required")
<<<<<<< HEAD
    @Size(min = 6, message = "Password must be at least 6 characters")
=======
    @Size(min = 8, message = "Password must be at least 8 characters")
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
<<<<<<< HEAD
    @jakarta.validation.constraints.Pattern(
        regexp = ".*@[jJ][sS][bB][lL]\\.[cC][oO][mM]$",
        message = "Email must be a valid JSBL email address (@jsbl.com)"
    )
    private String email;

    private String phone;
    private String department;
=======
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@jsbl\\.com$", message = "Only @jsbl.com email addresses are allowed")
    private String email;

    private String phone;

    private String department;

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
}
