package pka.edu.controller;

import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.request.RoundCriteriaRequest;
import pka.edu.dto.request.RoundCriterionCreateRequest;
import pka.edu.dto.request.RoundCriterionUpdateRequest;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.dto.response.RoundCriterionResponse;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.service.IRoundCriteriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/round-criterias")
@RequiredArgsConstructor
public class RoundCriteriaController {
    private final IRoundCriteriaService roundCriteriaService;

    @GetMapping
    public ResponseEntity<PageResponseDTO<RoundCriterionResponse>> getCriterionInRound(@Valid @RequestBody RoundCriteriaRequest request,
                                                                                       @ModelAttribute PageRequestDTO pageRequestDTO) throws ResourceNotFoundException, ResourceBadRequestException {
        return new ResponseEntity<>(roundCriteriaService.getAllCriteriaInRound(request, pageRequestDTO), HttpStatus.OK);
    }

    @GetMapping("/{roundCriteriaId}")
    public ResponseEntity<ApiResponse<RoundCriterionResponse>> getCriterionInRoundById(@PathVariable Long roundCriteriaId) throws ResourceNotFoundException {
        return new ResponseEntity<>(roundCriteriaService.getCriterionInRoundById(roundCriteriaId), HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoundCriterionResponse>> createCriterionInRound(@Valid @RequestBody RoundCriterionCreateRequest request) throws ResourceNotFoundException, ResourceConflictException {
        return new ResponseEntity<>(roundCriteriaService.createCriterionInRound(request), HttpStatus.CREATED);
    }

    @PutMapping("/{roundCriteriaId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoundCriterionResponse>> updateWeight(@PathVariable Long roundCriteriaId, @Valid @RequestBody RoundCriterionUpdateRequest request) throws ResourceNotFoundException {
        return new ResponseEntity<>(roundCriteriaService.updateWeight(roundCriteriaId, request), HttpStatus.OK);
    }

    @DeleteMapping("/{roundCriteriaId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteCriterionInRound(@PathVariable Long roundCriteriaId) throws ResourceNotFoundException {
        return new ResponseEntity<>(roundCriteriaService.deleteCriterionInRound(roundCriteriaId), HttpStatus.OK);
    }
}
