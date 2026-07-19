package pka.edu.service;

import pka.edu.dto.request.EvaluationCriteriaCreateRequest;
import pka.edu.dto.request.EvaluationCriteriaUpdateRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.EvaluationCriteriaResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;

public interface IEvaluationCriteriaService {
    ApiResponse<EvaluationCriteriaResponse> createCriteria(EvaluationCriteriaCreateRequest request) throws ResourceConflictException;
    PageResponseDTO<EvaluationCriteriaResponse> getAllCriteria(String search, PageRequestDTO pageRequestDTO);
    ApiResponse<EvaluationCriteriaResponse> getCriteriaById(Long id) throws ResourceNotFoundException;
    ApiResponse<EvaluationCriteriaResponse> updateCriteria(Long id, EvaluationCriteriaUpdateRequest request) throws ResourceNotFoundException, ResourceConflictException;
    ApiResponse<String> deleteCriteria(Long id) throws ResourceNotFoundException;
}
