package pka.edu.controller;

import pka.edu.dto.request.InternshipAssignmentCreateRequest;
import pka.edu.dto.request.InternshipAssignmentUpdateRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.InternshipAssignmentResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.service.InternshipAssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/internship-assignments")
@RequiredArgsConstructor
public class InternshipAssignmentController {
    private final InternshipAssignmentService internshipAssignmentService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<InternshipAssignmentResponse>> createInternshipAssignment(@Valid @RequestBody InternshipAssignmentCreateRequest request) throws ResourceConflictException, ResourceNotFoundException {
        return new ResponseEntity<>(internshipAssignmentService.createInternshipAssignment(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<PageResponseDTO<InternshipAssignmentResponse>> getAllInternshipAssignments(@RequestParam(required = false) String search,
                                                                                                     @ModelAttribute PageRequestDTO pageRequestDTO) throws ResourceNotFoundException, ResourceForbiddenException {
        return new ResponseEntity<>(internshipAssignmentService.getAllInternshipAssignment(search, pageRequestDTO), HttpStatus.OK);
    }

    @GetMapping("/{assignmentId}")
    public ResponseEntity<ApiResponse<InternshipAssignmentResponse>> getInternshipAssignmentById(@PathVariable Long assignmentId) throws ResourceNotFoundException, ResourceForbiddenException {
        return new ResponseEntity<>(internshipAssignmentService.getInternshipAssignmentById(assignmentId), HttpStatus.OK);
    }

    @PutMapping("/{assignmentId}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<InternshipAssignmentResponse>> updateStatusAssignment(@PathVariable Long assignmentId, @Valid @RequestBody InternshipAssignmentUpdateRequest request) throws ResourceNotFoundException, ResourceBadRequestException {
        return new ResponseEntity<>(internshipAssignmentService.updateInternshipAssignment(assignmentId, request), HttpStatus.OK);
    }
}
