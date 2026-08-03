package pka.edu.service;

import pka.edu.dto.request.*;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.dto.response.UserResponse;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.exception.ResourceNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IUserService {
    PageResponseDTO<UserResponse> getAllProfile(String role, String search, PageRequestDTO pageRequestDTO) throws ResourceConflictException, ResourceBadRequestException, ResourceForbiddenException;
    ApiResponse<UserResponse> getProfileById(Long id) throws ResourceConflictException, ResourceNotFoundException;
    ApiResponse<UserResponse> createProfile(UserCreateRequest userCreateRequest) throws ResourceConflictException, ResourceBadRequestException, ResourceForbiddenException;
    ApiResponse<UserResponse> updateProfile(Long id, UserUpdateRequest userUpdateRequest) throws ResourceConflictException, ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<UserResponse> updateStatus(Long id) throws ResourceConflictException, ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<UserResponse> updateRole(Long id, UpdateRoleRequest request) throws ResourceConflictException, ResourceNotFoundException, ResourceForbiddenException, ResourceBadRequestException;
    ApiResponse<String> deleteProfile(Long id) throws ResourceConflictException, ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<String> changePassword(ChangePasswordRequest request) throws ResourceBadRequestException;
    ApiResponse<String> uploadAvatar(Long userId, MultipartFile file) throws ResourceNotFoundException, IOException, ResourceForbiddenException;
}
