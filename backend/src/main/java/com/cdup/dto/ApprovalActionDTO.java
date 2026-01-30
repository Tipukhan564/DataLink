package com.cdup.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ApprovalActionDTO {

    @NotNull(message = "Request ID is required")
    private Long requestId;

    @NotBlank(message = "Action is required (APPROVE or REJECT)")
    private String action;

    private String comments;

    public ApprovalActionDTO() {}

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}
