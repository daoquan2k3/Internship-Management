package pka.edu.controller;

import pka.edu.dto.request.UniversityJoinRequestRequest;
import pka.edu.dto.request.UpdateJoinRequestStatusRequest;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.dto.response.UniversityJoinRequestResponse;
import pka.edu.service.IUniversityJoinRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import pka.edu.exception.ResourceForbiddenException;

@RestController
@RequestMapping("/api/v1/university-requests")
@RequiredArgsConstructor
public class UniversityJoinRequestController {

    private final IUniversityJoinRequestService requestService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'ROLE_TEACHER')")
    public ResponseEntity<UniversityJoinRequestResponse> createRequest(
            @Valid @RequestBody UniversityJoinRequestRequest request,
            @AuthenticationPrincipal pka.edu.security.principal.UserPrincipal userPrincipal) {
        return ResponseEntity.ok(requestService.createRequest(request, userPrincipal.getUsers().getUserId()));
    }

    @PutMapping("/{requestId}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_UNIVERSITY_REP', 'ROLE_ADMIN')")
    public ResponseEntity<UniversityJoinRequestResponse> updateStatus(
            @PathVariable Long requestId,
            @Valid @RequestBody UpdateJoinRequestStatusRequest request,
            @AuthenticationPrincipal pka.edu.security.principal.UserPrincipal userPrincipal) {
        return ResponseEntity.ok(requestService.updateStatus(requestId, request, userPrincipal.getUsers().getUserId()));
    }

    @GetMapping("/university/{universityId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_UNIVERSITY_REP')")
    public ResponseEntity<PageResponseDTO<UniversityJoinRequestResponse>> getRequestsByUniversity(
            @PathVariable Long universityId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) throws ResourceForbiddenException {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return ResponseEntity.ok(requestService.getRequestsByUniversity(universityId, status, pageable));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'ROLE_TEACHER')")
    public ResponseEntity<PageResponseDTO<UniversityJoinRequestResponse>> getMyRequests(
            @AuthenticationPrincipal pka.edu.security.principal.UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return ResponseEntity.ok(requestService.getMyRequests(userPrincipal.getUsers().getUserId(), pageable));
    }
}
