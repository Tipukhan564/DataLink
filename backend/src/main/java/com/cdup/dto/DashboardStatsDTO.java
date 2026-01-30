package com.cdup.dto;

import java.util.Map;

public class DashboardStatsDTO {
    private long totalRequests;
    private long pendingRequests;
    private long approvedRequests;
    private long completedRequests;
    private long failedRequests;
    private long todayRequests;
    private long weekRequests;
    private double successRate;
    private double avgProcessingTimeMinutes;
    private Map<String, Long> requestsByStatus;
    private Map<String, Long> requestsByDay;

    public DashboardStatsDTO() {}

    public long getTotalRequests() { return totalRequests; }
    public void setTotalRequests(long totalRequests) { this.totalRequests = totalRequests; }
    public long getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(long pendingRequests) { this.pendingRequests = pendingRequests; }
    public long getApprovedRequests() { return approvedRequests; }
    public void setApprovedRequests(long approvedRequests) { this.approvedRequests = approvedRequests; }
    public long getCompletedRequests() { return completedRequests; }
    public void setCompletedRequests(long completedRequests) { this.completedRequests = completedRequests; }
    public long getFailedRequests() { return failedRequests; }
    public void setFailedRequests(long failedRequests) { this.failedRequests = failedRequests; }
    public long getTodayRequests() { return todayRequests; }
    public void setTodayRequests(long todayRequests) { this.todayRequests = todayRequests; }
    public long getWeekRequests() { return weekRequests; }
    public void setWeekRequests(long weekRequests) { this.weekRequests = weekRequests; }
    public double getSuccessRate() { return successRate; }
    public void setSuccessRate(double successRate) { this.successRate = successRate; }
    public double getAvgProcessingTimeMinutes() { return avgProcessingTimeMinutes; }
    public void setAvgProcessingTimeMinutes(double avgProcessingTimeMinutes) { this.avgProcessingTimeMinutes = avgProcessingTimeMinutes; }
    public Map<String, Long> getRequestsByStatus() { return requestsByStatus; }
    public void setRequestsByStatus(Map<String, Long> requestsByStatus) { this.requestsByStatus = requestsByStatus; }
    public Map<String, Long> getRequestsByDay() { return requestsByDay; }
    public void setRequestsByDay(Map<String, Long> requestsByDay) { this.requestsByDay = requestsByDay; }
}
