package pka.edu.service;

import pka.edu.dto.request.InternshipPhaseCreateRequest;
import pka.edu.dto.request.InternshipPhaseUpdateRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.InternshipPhaseResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;

public interface InternshipPhaseService {
    ApiResponse<InternshipPhaseResponse> createInternshipPhase(InternshipPhaseCreateRequest request) throws ResourceConflictException;
    PageResponseDTO<InternshipPhaseResponse> getAllInternshipPhase(String search, PageRequestDTO pageRequestDTO);
    ApiResponse<InternshipPhaseResponse> getInternshipPhaseById(Long id) throws ResourceNotFoundException;
    ApiResponse<InternshipPhaseResponse> updateInternshipPhase(Long id, InternshipPhaseUpdateRequest request) throws ResourceNotFoundException, ResourceConflictException, ResourceBadRequestException;
    ApiResponse<String> deleteInternshipPhase(Long id) throws ResourceNotFoundException;
}
