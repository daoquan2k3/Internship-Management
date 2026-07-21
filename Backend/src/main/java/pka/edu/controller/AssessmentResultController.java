package pka.edu.controller;

import pka.edu.dto.request.AssessmentResultCreateRequest;
import pka.edu.dto.request.AssessmentResultUpdateRequest;
import pka.edu.dto.request.BulkAssessmentSaveRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.AssessmentResultResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.service.IAssessmentResultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assessment-results")
@RequiredArgsConstructor
public class AssessmentResultController {
    private final IAssessmentResultService assessmentResultService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_MENTOR')")
    public ResponseEntity<ApiResponse<List<AssessmentResultResponse>>> createAssessmentResult(@Valid @RequestBody AssessmentResultCreateRequest request) throws ResourceConflictException, ResourceForbiddenException, ResourceNotFoundException {
        return new ResponseEntity<>(assessmentResultService.createAssessmentResult(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<PageResponseDTO<AssessmentResultResponse>> getAllAssessmentResults(@RequestParam(required = false) Long assignmentId,
                                                                                             @RequestParam(required = false) String search,
                                                                                             @ModelAttribute PageRequestDTO request) throws ResourceConflictException, ResourceForbiddenException, ResourceNotFoundException {
        return new ResponseEntity<>(assessmentResultService.getAllAssessmentResult(search,assignmentId, request), HttpStatus.OK);
    }
    @PutMapping("/{resultId}")
    @PreAuthorize("hasAuthority('ROLE_MENTOR')")
    public ResponseEntity<ApiResponse<AssessmentResultResponse>> updateAssessmentResult(@PathVariable Long resultId,
                                                                                             @Valid @RequestBody AssessmentResultUpdateRequest request) throws ResourceConflictException, ResourceForbiddenException, ResourceNotFoundException {
        return new ResponseEntity<>(assessmentResultService.updateAssessmentResult(resultId, request), HttpStatus.OK);
    }

    @GetMapping("/{resultId}")
    public ResponseEntity<ApiResponse<AssessmentResultResponse>> getAssessmentResultById(@PathVariable Long resultId) throws ResourceConflictException, ResourceForbiddenException, ResourceNotFoundException {
        return new ResponseEntity<>(assessmentResultService.getAssessmentResultById(resultId), HttpStatus.OK);
    }

    @PostMapping("/bulk")
     @PreAuthorize("hasAuthority('ROLE_MENTOR')")
    public ResponseEntity<ApiResponse<Void>> saveBulkGrades(@RequestBody @Valid BulkAssessmentSaveRequest request) throws ResourceNotFoundException, ResourceConflictException, ResourceForbiddenException {

        assessmentResultService.saveBulkGrades(request);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Đã lưu điểm cho toàn bộ nhóm thành công!")
                .build();

        return ResponseEntity.ok(response);
    }
}
