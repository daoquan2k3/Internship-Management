package pka.edu.controller;

import pka.edu.dto.request.MentorCreateRequest;
import pka.edu.dto.request.MentorUpdateRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.MentorResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.service.IMentorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/mentors")
@RequiredArgsConstructor
public class MentorController {
    private final IMentorService mentorService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STUDENT', 'ROLE_COMPANY_REP', 'ROLE_UNIVERSITY_REP', 'ROLE_TEACHER')")
    public ResponseEntity<PageResponseDTO<Object>> getAllMentors(@RequestParam(required = false) String search, @ModelAttribute PageRequestDTO pageRequestDTO) throws ResourceForbiddenException, ResourceNotFoundException {
        return new ResponseEntity<>(mentorService.getAllMentor(pageRequestDTO, search), HttpStatus.OK);
    }

    @GetMapping("/{mentorId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Object>> getMentorById(@PathVariable Long mentorId) throws ResourceNotFoundException, ResourceForbiddenException {
        return new ResponseEntity<>(mentorService.getMentorById(mentorId), HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<MentorResponse>> createMentor(@Valid @RequestBody MentorCreateRequest request) throws ResourceConflictException, ResourceForbiddenException, ResourceNotFoundException, ResourceBadRequestException {
        return new ResponseEntity<>(mentorService.createMentor(request), HttpStatus.CREATED);
    }

    @PutMapping("/{mentorId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR', 'ROLE_COMPANY_MENTOR')")
    public ResponseEntity<ApiResponse<MentorResponse>> updateMentor(@PathVariable Long mentorId, @Valid @RequestBody MentorUpdateRequest request) throws ResourceConflictException, ResourceForbiddenException, ResourceNotFoundException, ResourceBadRequestException {
        return new ResponseEntity<>(mentorService.updateMentor(mentorId, request), HttpStatus.OK);
    }

    @GetMapping("/info")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<MentorResponse>> getMentorInfo(Authentication authentication) throws ResourceNotFoundException {
        String username = authentication.getName();
        return new ResponseEntity<>(mentorService.getMentorInfo(username), HttpStatus.OK);
    }
}
