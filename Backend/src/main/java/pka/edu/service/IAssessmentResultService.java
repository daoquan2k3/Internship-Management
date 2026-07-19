package pka.edu.service;

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

import java.util.List;

public interface IAssessmentResultService {
    ApiResponse<List<AssessmentResultResponse>> createAssessmentResult(AssessmentResultCreateRequest request) throws ResourceNotFoundException, ResourceForbiddenException, ResourceConflictException;

    PageResponseDTO<AssessmentResultResponse> getAllAssessmentResult(String search, Long assignmentId, PageRequestDTO requestDTO) throws ResourceNotFoundException, ResourceForbiddenException;

    ApiResponse<AssessmentResultResponse> updateAssessmentResult(Long id, AssessmentResultUpdateRequest request) throws ResourceNotFoundException, ResourceForbiddenException, ResourceConflictException;

    ApiResponse<AssessmentResultResponse> getAssessmentResultById(Long resultId) throws ResourceNotFoundException;

    void saveBulkGrades(BulkAssessmentSaveRequest request) throws ResourceNotFoundException, ResourceConflictException;
}
