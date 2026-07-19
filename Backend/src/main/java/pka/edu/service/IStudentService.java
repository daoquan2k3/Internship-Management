package pka.edu.service;

import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.request.StudentCreateRequest;
import pka.edu.dto.request.StudentUpdateRequest;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.dto.response.StudentResponse;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.exception.ResourceNotFoundException;

public interface IStudentService {
    ApiResponse<StudentResponse> createStudent(StudentCreateRequest request) throws ResourceConflictException, ResourceNotFoundException, ResourceBadRequestException, ResourceForbiddenException;
    PageResponseDTO<StudentResponse> getAllStudent(PageRequestDTO pageRequestDTO) throws ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<StudentResponse> getCurrentStudentInfo() throws ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<StudentResponse> getStudentById(Long id) throws ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<StudentResponse> updateStudent(Long id, StudentUpdateRequest request) throws ResourceNotFoundException, ResourceBadRequestException, ResourceForbiddenException, ResourceConflictException;
}
