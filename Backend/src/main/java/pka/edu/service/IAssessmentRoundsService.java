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
    ApiResponse<AssessmentRoundsResponse> createAssessmentRound(AssessmentRoundCreateRequest request) throws ResourceNotFoundException, ResourceConflictException, pka.edu.exception.ResourceForbiddenException;
    PageResponseDTO<AssessmentRoundsResponse> getAllAssessmentRound(String search,Long phaseId, Long classId, PageRequestDTO pageRequestDTO);
    ApiResponse<AssessmentRoundsResponse> getAssessmentRoundById(Long id) throws ResourceNotFoundException;
     ApiResponse<AssessmentRoundsResponse> updateAssessmentRound(Long id, AssessmentRoundUpdateRequest request) throws ResourceNotFoundException, ResourceConflictException, ResourceBadRequestException, pka.edu.exception.ResourceForbiddenException;
     ApiResponse<String> deleteAssessmentRound(Long id) throws ResourceNotFoundException, pka.edu.exception.ResourceForbiddenException;
}
