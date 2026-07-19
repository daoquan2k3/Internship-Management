package pka.edu.service;

import pka.edu.dto.request.AssessmentRoundCreateRequest;
import pka.edu.dto.request.AssessmentRoundUpdateRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.AssessmentRoundsResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;

public interface IAssessmentRoundsService {
    ApiResponse<AssessmentRoundsResponse> createAssessmentRound(AssessmentRoundCreateRequest request) throws ResourceNotFoundException, ResourceConflictException;
    PageResponseDTO<AssessmentRoundsResponse> getAllAssessmentRound(String search,Long phaseId,  PageRequestDTO pageRequestDTO);
    ApiResponse<AssessmentRoundsResponse> getAssessmentRoundById(Long id) throws ResourceNotFoundException;
     ApiResponse<AssessmentRoundsResponse> updateAssessmentRound(Long id, AssessmentRoundUpdateRequest request) throws ResourceNotFoundException, ResourceConflictException, ResourceBadRequestException;
     ApiResponse<String> deleteAssessmentRound(Long id) throws ResourceNotFoundException;
}
