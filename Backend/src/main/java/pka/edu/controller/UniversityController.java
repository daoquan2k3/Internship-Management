package pka.edu.controller;

import pka.edu.dto.request.UniversityRequest;
import pka.edu.dto.response.UniversityResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.service.IUniversityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/universities")
@RequiredArgsConstructor
public class UniversityController {

    private final IUniversityService IUniversityService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<UniversityResponse> createUniversity(@Valid @RequestBody UniversityRequest request) {
        return new ResponseEntity<>(IUniversityService.createUniversity(request), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PageResponseDTO<UniversityResponse>> getAllUniversities(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "") String search) {
        Pageable pageable = PageRequest.of(page - 1, size);
        return ResponseEntity.ok(IUniversityService.getAllUniversities(search, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UniversityResponse> getUniversityById(@PathVariable Long id) {
        return ResponseEntity.ok(IUniversityService.getUniversityById(id));
    }
}
