package pka.edu.controller;

import pka.edu.dto.request.AssessmentRoundCreateRequest;
import pka.edu.dto.request.AssessmentRoundUpdateRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.AssessmentRoundsResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.service.IAssessmentRoundsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/assessment-rounds")
@RequiredArgsConstructor
public class AssessmentRoundsController {

    private final IAssessmentRoundsService assessmentRoundsService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_UNIVERSITY_REP', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<AssessmentRoundsResponse>> createAssessmentRound(@Valid @RequestBody AssessmentRoundCreateRequest request) throws ResourceNotFoundException, ResourceConflictException, pka.edu.exception.ResourceForbiddenException {
        return new ResponseEntity<>(assessmentRoundsService.createAssessmentRound(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<PageResponseDTO<AssessmentRoundsResponse>> getAllAssessmentRound(@RequestParam(required = false) String search,
                                                                                           @RequestParam(required = false) Long phaseId,
                                                                                           @RequestParam(required = false) Long classId,
                                                                                           @ModelAttribute PageRequestDTO request){
        return new ResponseEntity<>(assessmentRoundsService.getAllAssessmentRound(search, phaseId, classId, request), HttpStatus.OK);
    }

    @GetMapping("/{roundId}")
    public ResponseEntity<ApiResponse<AssessmentRoundsResponse>> getAssessmentRoundById(@PathVariable Long roundId) throws ResourceNotFoundException {
        return new ResponseEntity<>(assessmentRoundsService.getAssessmentRoundById(roundId), HttpStatus.OK);
    }

     @PutMapping("/{roundId}")
     @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_UNIVERSITY_REP', 'ROLE_TEACHER')")
     public ResponseEntity<ApiResponse<AssessmentRoundsResponse>> updateAssessmentRound(@PathVariable Long roundId,
                                                                                        @Valid @RequestBody AssessmentRoundUpdateRequest request) throws ResourceNotFoundException, ResourceConflictException, ResourceBadRequestException, pka.edu.exception.ResourceForbiddenException {
         return new ResponseEntity<>(assessmentRoundsService.updateAssessmentRound(roundId, request), HttpStatus.OK);
     }

     @DeleteMapping("/{roundId}")
     @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_UNIVERSITY_REP', 'ROLE_TEACHER')")
     public ResponseEntity<ApiResponse<String>> deleteAssessmentRound(@PathVariable Long roundId) throws ResourceNotFoundException, pka.edu.exception.ResourceForbiddenException {
         return new ResponseEntity<>(assessmentRoundsService.deleteAssessmentRound(roundId), HttpStatus.OK);
     }
}
