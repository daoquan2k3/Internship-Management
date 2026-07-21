package pka.edu.service.impl;

import pka.edu.dto.request.*;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.dto.response.UserResponse;
import pka.edu.entity.User;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.mapper.UserMapper;
import pka.edu.repository.IUserRepository;
import pka.edu.repository.IStudentRepository;
import pka.edu.repository.IMentorRepository;
import pka.edu.service.IUserService;
import pka.edu.util.CurrentUserUtil;
import pka.edu.util.PaginationUtil;
import pka.edu.util.ValidationErrorUtil;
import pka.edu.util.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    private final IUserRepository userRepository;
    private final IStudentRepository studentRepository;
    private final IMentorRepository mentorRepository;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserUtil currentUserUtil;
    private final FileUploadService fileUploadService;

    @Override
    public PageResponseDTO<UserResponse> getAllProfile(String role, PageRequestDTO pageRequestDTO) throws ResourceBadRequestException {

        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "user");

        Page<User> usersPage;
        Role roleEnum = null;
        if (role != null && !role.isBlank()) {
            try {
                roleEnum = Role.valueOf(role.toUpperCase());
            } catch (IllegalArgumentException e) {
                ValidationErrorUtil.addError(errorList, "role", "Invalid role value");
                throw new ResourceBadRequestException("BAD_REQUEST", errorList);
            }
        }

        if (roleEnum != null) {
            usersPage = userRepository.findByRoleAndIsDeletedFalseAndIsActiveTrue(Role.valueOf(role.toUpperCase()), pageable);
        } else {
            usersPage = userRepository.findAllByIsDeletedFalseAndIsActiveTrue(pageable);
        }

        return PaginationUtil.toPageResponseDTO(usersPage, UserMapper::toDto);
    }

    @Override
    public ApiResponse<UserResponse> getProfileById(Long id) throws ResourceNotFoundException {
        User users = userRepository.findByUserIdAndIsDeletedFalseAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return new ApiResponse<>(UserMapper.toDto(users), true, "SUCCESS", null, null);
    }

    @Override
    public ApiResponse<UserResponse> createProfile(UserCreateRequest userCreateRequest) throws ResourceBadRequestException, ResourceConflictException {
        Role roleEnum = null;
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();

        if (userRepository.existsByUsernameAndIsDeletedFalseAndIsActiveTrue(userCreateRequest.getUsername())) {
            ValidationErrorUtil.addError(errorList, "username", "Username already exists");
        }

        if (userRepository.existsByEmailAndIsDeletedFalseAndIsActiveTrue(userCreateRequest.getEmail())) {
            ValidationErrorUtil.addError(errorList, "email", "Email already exists");
        }

        if (ValidationErrorUtil.hasErrors(errorList)) {
            throw new ResourceConflictException("CONFLICT", errorList);
        }

        try {
            roleEnum = Role.valueOf(userCreateRequest.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            ValidationErrorUtil.addError(errorList, "role", "Invalid role value");
            throw new ResourceBadRequestException("BAD_REQUEST", errorList);
        }

        if (roleEnum == Role.ROLE_STUDENT) {
            if (userCreateRequest.getStudentCode() == null || userCreateRequest.getStudentCode().isBlank()) {
                ValidationErrorUtil.addError(errorList, "studentCode", "Student code is required");
            } else if (studentRepository.existsByStudentCode(userCreateRequest.getStudentCode())) {
                ValidationErrorUtil.addError(errorList, "studentCode", "Student code already exists");
            }
            if (userCreateRequest.getMajor() == null || userCreateRequest.getMajor().isBlank()) {
                ValidationErrorUtil.addError(errorList, "major", "Major is required");
            }
            if (userCreateRequest.getClassRoom() == null || userCreateRequest.getClassRoom().isBlank()) {
                ValidationErrorUtil.addError(errorList, "classRoom", "Class room is required");
            }
            if (userCreateRequest.getDateOfBirth() == null) {
                ValidationErrorUtil.addError(errorList, "dateOfBirth", "Date of birth is required");
            } else if (userCreateRequest.getDateOfBirth().isAfter(java.time.LocalDate.now())) {
                ValidationErrorUtil.addError(errorList, "dateOfBirth", "Date of birth must be in the past");
            }
            if (userCreateRequest.getAddress() == null || userCreateRequest.getAddress().isBlank()) {
                ValidationErrorUtil.addError(errorList, "address", "Address is required");
            }
            if (ValidationErrorUtil.hasErrors(errorList)) {
                throw new ResourceBadRequestException("BAD_REQUEST", errorList);
            }
        } else if (roleEnum == Role.ROLE_MENTOR) {
            if (userCreateRequest.getDepartment() == null || userCreateRequest.getDepartment().isBlank()) {
                ValidationErrorUtil.addError(errorList, "department", "Department is required");
            }
            if (userCreateRequest.getAcademicRank() == null || userCreateRequest.getAcademicRank().isBlank()) {
                ValidationErrorUtil.addError(errorList, "academicRank", "Academic rank is required");
            }
            if (ValidationErrorUtil.hasErrors(errorList)) {
                throw new ResourceBadRequestException("BAD_REQUEST", errorList);
            }
        }

        User users = new User();

        users.setUsername(userCreateRequest.getUsername());
        users.setPassword(passwordEncoder.encode(userCreateRequest.getPassword()));
        users.setFullName(userCreateRequest.getFullName());
        users.setEmail(userCreateRequest.getEmail());
        users.setPhoneNumber(userCreateRequest.getPhoneNumber());
        users.setRole(roleEnum);

        userRepository.save(users);

        if (roleEnum == Role.ROLE_STUDENT) {
            pka.edu.entity.Student student = new pka.edu.entity.Student();
            student.setUser(users);
            student.setStudentCode(userCreateRequest.getStudentCode());
            student.setMajor(userCreateRequest.getMajor());
            student.setClassRoom(userCreateRequest.getClassRoom());
            student.setDateOfBirth(userCreateRequest.getDateOfBirth());
            student.setAddress(userCreateRequest.getAddress());
            studentRepository.save(student);
        } else if (roleEnum == Role.ROLE_MENTOR) {
            pka.edu.entity.Mentor mentor = new pka.edu.entity.Mentor();
            mentor.setUser(users);
            mentor.setDepartment(userCreateRequest.getDepartment());
            mentor.setAcademicRank(userCreateRequest.getAcademicRank());
            mentorRepository.save(mentor);
        }

        return new ApiResponse<>(UserMapper.toDto(users), true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    public ApiResponse<UserResponse> updateProfile(Long id, UserUpdateRequest userUpdateRequest) throws ResourceConflictException, ResourceNotFoundException, ResourceForbiddenException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        User currentUser = currentUserUtil.getCurrentUser();
        User existingUser;

        if (currentUser.getRole() == Role.ROLE_ADMIN) {
            existingUser = userRepository.findByUserIdAndIsDeletedFalseAndIsActiveTrue(id)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        } else {
            if (!currentUser.getUserId().equals(id)) {
                throw new ResourceForbiddenException("You cannot update other user's profile");
            }
            existingUser = currentUser;
        }

        if (userRepository.existsByUsernameAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(userUpdateRequest.getUsername(), id)) {
            errorList.put("username", "Username already exists");
        }

        if (userRepository.existsByEmailAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(userUpdateRequest.getEmail(), id)) {
            errorList.put("email", "Email already exists");
        }
        if (ValidationErrorUtil.hasErrors(errorList)) {
            throw new ResourceConflictException("CONFLICT", errorList);
        }
        UserMapper.updateFromDto(existingUser, userUpdateRequest);
        userRepository.save(existingUser);

        if (existingUser.getRole() == Role.ROLE_STUDENT) {
            pka.edu.entity.Student student = studentRepository.findById(existingUser.getUserId()).orElse(new pka.edu.entity.Student());
            student.setUser(existingUser);
            if (userUpdateRequest.getStudentCode() != null) student.setStudentCode(userUpdateRequest.getStudentCode());
            if (userUpdateRequest.getMajor() != null) student.setMajor(userUpdateRequest.getMajor());
            if (userUpdateRequest.getClassRoom() != null) student.setClassRoom(userUpdateRequest.getClassRoom());
            if (userUpdateRequest.getDateOfBirth() != null) student.setDateOfBirth(userUpdateRequest.getDateOfBirth());
            if (userUpdateRequest.getAddress() != null) student.setAddress(userUpdateRequest.getAddress());
            studentRepository.save(student);
        } else if (existingUser.getRole() == Role.ROLE_MENTOR) {
            pka.edu.entity.Mentor mentor = mentorRepository.findById(existingUser.getUserId()).orElse(new pka.edu.entity.Mentor());
            mentor.setUser(existingUser);
            if (userUpdateRequest.getDepartment() != null) mentor.setDepartment(userUpdateRequest.getDepartment());
            if (userUpdateRequest.getAcademicRank() != null) mentor.setAcademicRank(userUpdateRequest.getAcademicRank());
            mentorRepository.save(mentor);
        }

        return new ApiResponse<>(UserMapper.toDto(existingUser), true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    public ApiResponse<UserResponse> updateStatus(Long id) throws ResourceNotFoundException {
        User users = userRepository.findByUserIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        users.setActive(!users.isActive());
        userRepository.save(users);
        return new ApiResponse<>(UserMapper.toDto(users), true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    public ApiResponse<UserResponse> updateRole(Long id, UpdateRoleRequest request) throws ResourceNotFoundException, ResourceForbiddenException, ResourceBadRequestException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        User users = userRepository.findByUserIdAndIsDeletedFalseAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (users.getRole() == Role.ROLE_ADMIN) {
            throw new ResourceForbiddenException("Cannot change role of an admin user");
        }
        try {
            Role newRole = Role.valueOf(request.getRole().toUpperCase());
            Role oldRole = users.getRole();
            
            if (newRole != oldRole) {
                // Delete old role details
                if (oldRole == Role.ROLE_STUDENT) {
                    studentRepository.findById(users.getUserId()).ifPresent(studentRepository::delete);
                } else if (oldRole == Role.ROLE_MENTOR) {
                    mentorRepository.findById(users.getUserId()).ifPresent(mentorRepository::delete);
                }
                
                // Create new role details
                users.setRole(newRole);
                
                // Must save user first so that role change is persisted before cascading or creating related entities
                userRepository.save(users); 
                
                if (newRole == Role.ROLE_STUDENT) {
                    pka.edu.entity.Student newStudent = new pka.edu.entity.Student();
                    newStudent.setUser(users);
                    // Lỗi: Các trường bắt buộc như studentCode đang trống có thể gây DataIntegrityViolationException.
                    // Tạm thời vô hiệu hóa tài khoản và tạo một mã sinh viên ngẫu nhiên để pass validation. Admin/User cần update sau.
                    newStudent.setStudentCode("TEMP_STU_" + users.getUserId());
                    users.setActive(false);
                    studentRepository.save(newStudent);
                } else if (newRole == Role.ROLE_MENTOR) {
                    pka.edu.entity.Mentor newMentor = new pka.edu.entity.Mentor();
                    newMentor.setUser(users);
                    // Tạm thời vô hiệu hóa tài khoản để Admin/User cần update department sau.
                    users.setActive(false);
                    mentorRepository.save(newMentor);
                }
            }
        } catch (IllegalArgumentException e) {
            errorList.put("role", "Invalid role value");
            throw new ResourceBadRequestException("BAD_REQUEST", errorList);
        }
        userRepository.save(users);
        return new ApiResponse<>(UserMapper.toDto(users), true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    public ApiResponse<String> deleteProfile(Long id) throws ResourceNotFoundException {
        User users = userRepository.findByUserIdAndIsDeletedFalseAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        users.setDeleted(true);
        users.setActive(false);
        userRepository.save(users);
        return new ApiResponse<>("User deleted successfully", true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    public ApiResponse<String> changePassword(ChangePasswordRequest request) throws ResourceBadRequestException {
        User user = currentUserUtil.getCurrentUser();
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            errorList.put("oldPassword", "Old password is incorrect");
            throw new ResourceBadRequestException("Old password is incorrect", errorList);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return new ApiResponse<>("Password changed successfully", true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    public ApiResponse<String> uploadAvatar(Long userId, MultipartFile file) throws ResourceNotFoundException, IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String avatarUrl = fileUploadService.uploadFile(file);

        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);

        return new ApiResponse<>(avatarUrl, true, "Upload avatar successfully", null, LocalDateTime.now());
    }
}
