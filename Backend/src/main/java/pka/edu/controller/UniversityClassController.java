package pka.edu.controller;

import pka.edu.dto.request.UniversityClassRequest;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.dto.response.UniversityClassResponse;
import pka.edu.service.IUniversityClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/university-classes")
@RequiredArgsConstructor
public class UniversityClassController {

    private final IUniversityClassService classService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_UNIVERSITY_REP', 'ROLE_ADMIN')")
    public ResponseEntity<UniversityClassResponse> createClass(
            @Valid @RequestBody UniversityClassRequest request,
            @AuthenticationPrincipal pka.edu.security.principal.UserPrincipal userPrincipal) {
        return ResponseEntity.ok(classService.createClass(request, userPrincipal.getUsers().getUserId()));
    }

    @PutMapping("/{classId}")
    @PreAuthorize("hasAnyAuthority('ROLE_UNIVERSITY_REP', 'ROLE_ADMIN')")
    public ResponseEntity<UniversityClassResponse> updateClass(
            @PathVariable Long classId,
            @RequestBody UniversityClassRequest request,
            @AuthenticationPrincipal pka.edu.security.principal.UserPrincipal userPrincipal) {
        return ResponseEntity.ok(classService.updateClass(classId, request, userPrincipal.getUsers().getUserId()));
    }

    @PutMapping("/{classId}/assign-teacher/{teacherId}")
    @PreAuthorize("hasAnyAuthority('ROLE_UNIVERSITY_REP', 'ROLE_ADMIN')")
    public ResponseEntity<UniversityClassResponse> assignTeacher(
            @PathVariable Long classId,
            @PathVariable Long teacherId,
            @AuthenticationPrincipal pka.edu.security.principal.UserPrincipal userPrincipal) {
        return ResponseEntity.ok(classService.assignTeacher(classId, teacherId, userPrincipal.getUsers().getUserId()));
    }

    @GetMapping("/university/{universityId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PageResponseDTO<UniversityClassResponse>> getClassesByUniversity(
            @PathVariable Long universityId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return ResponseEntity.ok(classService.getClassesByUniversity(universityId, pageable));
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'ROLE_ADMIN')")
    public ResponseEntity<PageResponseDTO<UniversityClassResponse>> getClassesByTeacher(
            @PathVariable Long teacherId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return ResponseEntity.ok(classService.getClassesByTeacher(teacherId, pageable));
    }

    @GetMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PageResponseDTO<UniversityClassResponse>> getAllClasses(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "100") int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return ResponseEntity.ok(classService.getAllClasses(pageable));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'ROLE_STUDENT', 'ROLE_ADMIN', 'ROLE_UNIVERSITY_REP')")
    public ResponseEntity<PageResponseDTO<UniversityClassResponse>> getMyClasses(
            @AuthenticationPrincipal pka.edu.security.principal.UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "100") int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return ResponseEntity.ok(classService.getMyClasses(userPrincipal.getUsers().getUserId(), pageable));
    }
}
