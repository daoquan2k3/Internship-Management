package pka.edu.service;

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

public interface IRoundCriteriaService {
    PageResponseDTO<RoundCriterionResponse> getAllCriteriaInRound(RoundCriteriaRequest request, PageRequestDTO pageRequestDTO) throws ResourceNotFoundException, ResourceBadRequestException;
    ApiResponse<RoundCriterionResponse> getCriterionInRoundById(Long roundCriteriaId) throws ResourceNotFoundException;

    ApiResponse<RoundCriterionResponse> createCriterionInRound(RoundCriterionCreateRequest request) throws ResourceNotFoundException, ResourceConflictException;
    ApiResponse<RoundCriterionResponse> updateWeight(Long roundCriteriaId, RoundCriterionUpdateRequest request) throws ResourceNotFoundException;
    ApiResponse<String> deleteCriterionInRound(Long roundCriteriaId) throws ResourceNotFoundException;
}
