package com.cdup.config;

import org.springframework.context.annotation.Configuration;
<<<<<<< HEAD
=======
import org.springframework.lang.NonNull;
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
<<<<<<< HEAD
    public void addCorsMappings(CorsRegistry registry) {
=======
    public void addCorsMappings(@NonNull CorsRegistry registry) {
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:3000",
                    "http://localhost:5173",
                    "http://127.0.0.1:3000"
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "Content-Disposition")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
<<<<<<< HEAD
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
=======
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:./uploads/");

        registry.addResourceHandler("/templates/**")
                .addResourceLocations("classpath:/templates/");
    }

    @Override
<<<<<<< HEAD
    public void addInterceptors(InterceptorRegistry registry) {
=======
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
        // Add custom interceptors here if needed
    }
}
