package com.cdup.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@cdup.com}")
    private String fromEmail;

    @Value("${app.name:CDUP - Customer Data Update Portal}")
    private String appName;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendAccessGrantedEmail(String toEmail, String fullName, String username) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Access Granted - " + appName);
            message.setText(buildAccessGrantedMessage(fullName, username));

            mailSender.send(message);
            log.info("Access granted email sent to: {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send access granted email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendAccessRevokedEmail(String toEmail, String fullName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Access Revoked - " + appName);
            message.setText(buildAccessRevokedMessage(fullName));

            mailSender.send(message);
            log.info("Access revoked email sent to: {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send access revoked email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String fullName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Registration Received - " + appName);
            message.setText(buildWelcomeMessage(fullName));

            mailSender.send(message);
            log.info("Welcome email sent to: {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildAccessGrantedMessage(String fullName, String username) {
        return String.format("""
            Dear %s,

            Great news! Your access to the Customer Data Update Portal (CDUP) has been approved.

            You can now log in using the following credentials:
            - Username: %s
            - Password: (the password you set during registration)

            Portal URL: http://localhost:5173

            Please contact the administrator if you have any questions.

            Best regards,
            CDUP Administration Team
            JS Bank Limited
            """, fullName, username);
    }

    private String buildAccessRevokedMessage(String fullName) {
        return String.format("""
            Dear %s,

            Your access to the Customer Data Update Portal (CDUP) has been revoked.

            If you believe this is an error, please contact the administrator.

            Best regards,
            CDUP Administration Team
            JS Bank Limited
            """, fullName);
    }

    private String buildWelcomeMessage(String fullName) {
        return String.format("""
            Dear %s,

            Thank you for registering with the Customer Data Update Portal (CDUP).

            Your registration has been received and is pending administrator approval.
            You will receive another email once your access has been granted.

            Best regards,
            CDUP Administration Team
            JS Bank Limited
            """, fullName);
    }
}
