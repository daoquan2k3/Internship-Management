package pka.edu.service;

import pka.edu.dto.request.InternshipAssignmentCreateRequest;
import pka.edu.dto.request.InternshipAssignmentUpdateRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.InternshipAssignmentResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.exception.ResourceNotFoundException;

public interface InternshipAssignmentService {
    ApiResponse<InternshipAssignmentResponse> createInternshipAssignment(InternshipAssignmentCreateRequest request) throws ResourceNotFoundException, ResourceConflictException;
    PageResponseDTO<InternshipAssignmentResponse> getAllInternshipAssignment(String search, PageRequestDTO pageRequestDTO) throws ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<InternshipAssignmentResponse> getInternshipAssignmentById(Long internshipAssignmentId) throws ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<InternshipAssignmentResponse> updateInternshipAssignment(Long internshipAssignmentId, InternshipAssignmentUpdateRequest request) throws ResourceNotFoundException, ResourceBadRequestException;
}
