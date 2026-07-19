package pka.edu.controller;

import pka.edu.dto.request.EvaluationCriteriaCreateRequest;
import pka.edu.dto.request.EvaluationCriteriaUpdateRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.EvaluationCriteriaResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.service.IEvaluationCriteriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/evaluation-criterias")
@RequiredArgsConstructor
public class EvaluationCriteriaController {
    private final IEvaluationCriteriaService evaluationCriteriaService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<EvaluationCriteriaResponse>> createCriteria(@Valid @RequestBody EvaluationCriteriaCreateRequest request) throws ResourceConflictException {
        return new ResponseEntity<>(evaluationCriteriaService.createCriteria(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<PageResponseDTO<EvaluationCriteriaResponse>> getAllCriteria(@RequestParam(required = false) String search,
                                                                                      @ModelAttribute PageRequestDTO pageRequestDTO) {
        return new ResponseEntity<>(evaluationCriteriaService.getAllCriteria(search, pageRequestDTO), HttpStatus.OK);
    }

    @GetMapping("/{criteriaId}")
    public ResponseEntity<ApiResponse<EvaluationCriteriaResponse>> getCriteriaById(@PathVariable Long criteriaId) throws ResourceNotFoundException {
        return new ResponseEntity<>(evaluationCriteriaService.getCriteriaById(criteriaId), HttpStatus.OK);
    }

    @PutMapping("/{criteriaId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<EvaluationCriteriaResponse>> updateCriteria(@PathVariable Long criteriaId,
                                                                                  @Valid @RequestBody EvaluationCriteriaUpdateRequest request) throws ResourceNotFoundException, ResourceConflictException {
        return new ResponseEntity<>(evaluationCriteriaService.updateCriteria(criteriaId, request), HttpStatus.OK);
    }

    @DeleteMapping("/{criteriaId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteCriteria(@PathVariable Long criteriaId) throws ResourceNotFoundException {
        return new ResponseEntity<>(evaluationCriteriaService.deleteCriteria(criteriaId), HttpStatus.OK);
    }
}
