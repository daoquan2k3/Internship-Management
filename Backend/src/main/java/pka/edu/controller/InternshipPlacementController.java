package pka.edu.controller;

import pka.edu.dto.response.InternshipPlacementResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.service.IInternshipPlacementService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/placements")
@RequiredArgsConstructor
public class InternshipPlacementController {
    private final IInternshipPlacementService placementService;

    @PostMapping("/application/{applicationId}")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'ROLE_ADMIN')")
    public ResponseEntity<InternshipPlacementResponse> createPlacement(@PathVariable Long applicationId) {
        return ResponseEntity.ok(placementService.createPlacement(applicationId));
    }

    @PutMapping("/{placementId}/company/{companyId}")
    @PreAuthorize("hasAnyAuthority('ROLE_UNIVERSITY_REP', 'ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<InternshipPlacementResponse> assignCompany(@PathVariable Long placementId, @PathVariable Long companyId) {
        return ResponseEntity.ok(placementService.assignCompany(placementId, companyId));
    }

    @PutMapping("/{placementId}/mentor/{mentorId}")
    @PreAuthorize("hasAnyAuthority('ROLE_COMPANY_REP', 'ROLE_UNIVERSITY_REP', 'ROLE_ADMIN')")
    public ResponseEntity<InternshipPlacementResponse> assignMentor(@PathVariable Long placementId, @PathVariable Long mentorId) {
        return ResponseEntity.ok(placementService.assignMentor(placementId, mentorId));
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyAuthority('ROLE_UNIVERSITY_REP', 'ROLE_TEACHER', 'ROLE_ADMIN')")
    public ResponseEntity<PageResponseDTO<InternshipPlacementResponse>> getPlacementsByClass(
            @PathVariable Long classId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return ResponseEntity.ok(placementService.getPlacementsByClass(classId, pageable));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<PageResponseDTO<InternshipPlacementResponse>> getMyPlacements(
            @AuthenticationPrincipal pka.edu.security.principal.UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return ResponseEntity.ok(placementService.getMyPlacements(userPrincipal.getUsers().getUserId(), pageable));
    }
}
