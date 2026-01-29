package com.cdup.service;

import com.cdup.repository.CustomerUpdateRequestRepository;
import com.cdup.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final CustomerUpdateRequestRepository requestRepository;
    private final UserRepository userRepository;

    public ReportService(CustomerUpdateRequestRepository requestRepository,
                          UserRepository userRepository) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Object> generateSummaryReport(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> report = new HashMap<>();

        long total = requestRepository.countByCreatedAtBetween(startDate, endDate);
        report.put("totalRequests", total);
        report.put("period", Map.of("start", startDate.toString(), "end", endDate.toString()));

        Map<String, Long> statusBreakdown = new HashMap<>();
        List<Object[]> statusCounts = requestRepository.countByStatusGrouped();
        for (Object[] row : statusCounts) {
            statusBreakdown.put(row[0].toString(), (Long) row[1]);
        }
        report.put("statusBreakdown", statusBreakdown);

        long completed = statusBreakdown.getOrDefault("COMPLETED", 0L);
        long failed = statusBreakdown.getOrDefault("FAILED", 0L);
        double successRate = (completed + failed) > 0 ? (double) completed / (completed + failed) * 100 : 0;
        report.put("successRate", Math.round(successRate * 100.0) / 100.0);

        report.put("totalUsers", userRepository.count());
        report.put("activeUsers", userRepository.findByActiveTrue().size());

        return report;
    }

    public Map<String, Object> generateDailyReport() {
        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime todayEnd = todayStart.plusDays(1);
        return generateSummaryReport(todayStart, todayEnd);
    }

    public Map<String, Object> generateWeeklyReport() {
        LocalDateTime weekStart = LocalDateTime.now().minusDays(7).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime now = LocalDateTime.now();
        return generateSummaryReport(weekStart, now);
    }

    public Map<String, Object> generateMonthlyReport() {
        LocalDateTime monthStart = LocalDateTime.now().minusDays(30).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime now = LocalDateTime.now();
        return generateSummaryReport(monthStart, now);
    }
}
