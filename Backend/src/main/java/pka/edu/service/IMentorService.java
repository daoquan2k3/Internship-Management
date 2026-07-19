package pka.edu.service;

import pka.edu.dto.request.MentorCreateRequest;
import pka.edu.dto.request.MentorUpdateRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.MentorResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.exception.ResourceNotFoundException;

public interface IMentorService {
    PageResponseDTO<Object> getAllMentor(PageRequestDTO pageRequestDTO) throws ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<Object> getMentorById(Long id) throws ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<MentorResponse> createMentor(MentorCreateRequest request) throws ResourceNotFoundException, ResourceForbiddenException, ResourceBadRequestException, ResourceConflictException;
    ApiResponse<MentorResponse> updateMentor(Long id, MentorUpdateRequest request) throws ResourceNotFoundException, ResourceForbiddenException, ResourceBadRequestException, ResourceConflictException;
    ApiResponse<MentorResponse> getMentorInfo(String username) throws ResourceNotFoundException;
}
