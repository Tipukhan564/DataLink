package com.cdup.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("CDUP - Customer Data Update Portal API")
                        .version("2.1.0")
                        .description("""
                                RESTful API for the Customer Data Update Portal (CDUP).

                                This API provides endpoints for:
                                - User authentication and authorization
                                - Customer data update requests management
                                - Bulk upload processing
                                - Approval workflow management
                                - Audit trail and compliance reporting
                                - System administration

                                **Authentication:** All endpoints (except /auth/*) require a valid JWT token.
                                """)
                        .contact(new Contact()
                                .name("CDUP Support Team")
                                .email("support@cdup.com")
                                .url("https://cdup.com/support"))
                        .license(new License()
                                .name("Proprietary")
                                .url("https://cdup.com/license")))
                .servers(List.of(
                        new Server().url("http://localhost:" + serverPort + "/api").description("Development Server"),
                        new Server().url("https://api.cdup.com").description("Production Server")
                ))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter JWT token")));
    }
}
