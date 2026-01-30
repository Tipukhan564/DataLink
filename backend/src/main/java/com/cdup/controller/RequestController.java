package com.cdup.controller;

import com.cdup.dto.CustomerUpdateDTO;
import com.cdup.entity.CustomerUpdateRequest;
import com.cdup.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/requests")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<CustomerUpdateRequest> createRequest(@Valid @ModelAttribute CustomerUpdateDTO dto) {
        return ResponseEntity.ok(requestService.createRequest(dto));
    }
}
