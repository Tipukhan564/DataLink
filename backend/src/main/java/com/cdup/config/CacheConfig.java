package com.cdup.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@EnableCaching
public class CacheConfig {

    public static final String USERS_CACHE = "users";
    public static final String REQUESTS_CACHE = "requests";
    public static final String DASHBOARD_STATS_CACHE = "dashboardStats";
    public static final String REPORTS_CACHE = "reports";
    public static final String ENUM_VALUES_CACHE = "enumValues";

    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        cacheManager.setCaches(List.of(
                new ConcurrentMapCache(USERS_CACHE),
                new ConcurrentMapCache(REQUESTS_CACHE),
                new ConcurrentMapCache(DASHBOARD_STATS_CACHE),
                new ConcurrentMapCache(REPORTS_CACHE),
                new ConcurrentMapCache(ENUM_VALUES_CACHE)
        ));
        return cacheManager;
    }
}
