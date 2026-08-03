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
import pka.edu.repository.UserRepository;
import pka.edu.repository.StudentRepository;
import pka.edu.repository.MentorRepository;
import pka.edu.repository.UniversityRepository;
import pka.edu.repository.CompanyRepository;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final MentorRepository mentorRepository;
    private final UniversityRepository universityRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserUtil currentUserUtil;
    private final FileUploadService fileUploadService;

    @Override
    public PageResponseDTO<UserResponse> getAllProfile(String role, String search, PageRequestDTO pageRequestDTO)
            throws ResourceBadRequestException, ResourceForbiddenException {

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

        User currentUser = currentUserUtil.getCurrentUser();
        String searchParam = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        User dbUser = userRepository.findByUserIdAndIsDeletedFalseAndIsActiveTrue(currentUser.getUserId())
                .orElse(currentUser);

        Long uniId = (currentUser.getRole() == Role.ROLE_UNIVERSITY_REP && dbUser.getUniversity() != null)
                ? dbUser.getUniversity().getUniversityId()
                : null;
        Long compId = ((currentUser.getRole() == Role.ROLE_COMPANY_REP || currentUser.getRole() == Role.ROLE_COMPANY_MENTOR) 
                && dbUser.getCompany() != null)
                ? dbUser.getCompany().getCompanyId()
                : null;

        if (currentUser.getRole() == Role.ROLE_UNIVERSITY_REP && uniId == null) {
            throw new ResourceForbiddenException("University Representative must be assigned to a university");
        }
        if ((currentUser.getRole() == Role.ROLE_COMPANY_REP || currentUser.getRole() == Role.ROLE_COMPANY_MENTOR) && compId == null) {
            throw new ResourceForbiddenException("Company Staff must be assigned to a company");
        }

        if (searchParam != null) {
            if (roleEnum != null) {
                if (currentUser.getRole() == Role.ROLE_MENTOR) {
                    if (roleEnum != Role.ROLE_UNIVERSITY_REP && roleEnum != Role.ROLE_TEACHER &&
                            roleEnum != Role.ROLE_COMPANY_MENTOR && roleEnum != Role.ROLE_COMPANY_REP) {
                        throw new ResourceForbiddenException(
                                "Mentor can only view staff accounts (University Rep, Teacher, Company Rep, Company Mentor)");
                    }
                }
                usersPage = userRepository.searchUsers(roleEnum, uniId, compId, searchParam, pageable);
            } else {
                if (currentUser.getRole() == Role.ROLE_MENTOR) {
                    List<Role> mentorRoles = Arrays.asList(Role.ROLE_UNIVERSITY_REP, Role.ROLE_TEACHER,
                            Role.ROLE_COMPANY_MENTOR, Role.ROLE_COMPANY_REP);
                    usersPage = userRepository.searchUsersInRoles(mentorRoles, uniId, compId, searchParam, pageable);
                } else {
                    usersPage = userRepository.searchUsers(null, uniId, compId, searchParam, pageable);
                }
            }
        } else {
            if (roleEnum != null) {
                if (currentUser.getRole() == Role.ROLE_MENTOR) {
                    if (roleEnum != Role.ROLE_UNIVERSITY_REP && roleEnum != Role.ROLE_TEACHER &&
                            roleEnum != Role.ROLE_COMPANY_MENTOR && roleEnum != Role.ROLE_COMPANY_REP) {
                        throw new ResourceForbiddenException(
                                "Mentor can only view staff accounts (University Rep, Teacher, Company Rep, Company Mentor)");
                    }
                    usersPage = userRepository.findByRoleAndIsDeletedFalseAndIsActiveTrue(roleEnum, pageable);
                } else if (currentUser.getRole() == Role.ROLE_UNIVERSITY_REP) {
                    usersPage = userRepository.findByRoleAndUniversity_UniversityIdAndIsDeletedFalseAndIsActiveTrue(
                            roleEnum, uniId, pageable);
                } else if (currentUser.getRole() == Role.ROLE_COMPANY_REP || currentUser.getRole() == Role.ROLE_COMPANY_MENTOR) {
                    usersPage = userRepository.searchUsers(roleEnum, null, compId, "", pageable);
                } else {
                    usersPage = userRepository.findByRoleAndIsDeletedFalseAndIsActiveTrue(roleEnum, pageable);
                }
            } else {
                if (currentUser.getRole() == Role.ROLE_MENTOR) {
                    usersPage = userRepository.findByRoleInAndIsDeletedFalseAndIsActiveTrue(
                            Arrays.asList(Role.ROLE_UNIVERSITY_REP, Role.ROLE_TEACHER, Role.ROLE_COMPANY_MENTOR,
                                    Role.ROLE_COMPANY_REP),
                            pageable);
                } else if (currentUser.getRole() == Role.ROLE_UNIVERSITY_REP) {
                    usersPage = userRepository.findAllByUniversity_UniversityIdAndIsDeletedFalseAndIsActiveTrue(
                            uniId, pageable);
                } else if (currentUser.getRole() == Role.ROLE_COMPANY_REP || currentUser.getRole() == Role.ROLE_COMPANY_MENTOR) {
                    usersPage = userRepository.searchUsers(null, null, compId, "", pageable);
                } else {
                    usersPage = userRepository.findAllByIsDeletedFalseAndIsActiveTrue(pageable);
                }
            }
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
    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<UserResponse> createProfile(UserCreateRequest userCreateRequest)
            throws ResourceBadRequestException, ResourceConflictException, ResourceForbiddenException {
        Role roleEnum = null;
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();

        try {
            roleEnum = Role.valueOf(userCreateRequest.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            ValidationErrorUtil.addError(errorList, "role", "Invalid role value");
            throw new ResourceBadRequestException("BAD_REQUEST", errorList);
        }

        User currentUser = currentUserUtil.getCurrentUser();
        if (currentUser.getRole() == Role.ROLE_MENTOR) {
            if (roleEnum != Role.ROLE_UNIVERSITY_REP && roleEnum != Role.ROLE_TEACHER &&
                    roleEnum != Role.ROLE_COMPANY_MENTOR && roleEnum != Role.ROLE_COMPANY_REP) {
                throw new ResourceForbiddenException(
                        "Mentor can only create staff accounts (University Rep, Teacher, Company Rep, Company Mentor)");
            }
        } else if (currentUser.getRole() != Role.ROLE_ADMIN) {
            throw new ResourceForbiddenException("Unauthorized to create user profile");
        }

        if (userRepository.existsByUsernameAndIsDeletedFalseAndIsActiveTrue(userCreateRequest.getUsername())) {
            ValidationErrorUtil.addError(errorList, "username", "Username already exists");
        }

        if (userRepository.existsByEmailAndIsDeletedFalseAndIsActiveTrue(userCreateRequest.getEmail())) {
            ValidationErrorUtil.addError(errorList, "email", "Email already exists");
        }

        if (ValidationErrorUtil.hasErrors(errorList)) {
            throw new ResourceConflictException("CONFLICT", errorList);
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
            } else if (userCreateRequest.getDateOfBirth().isAfter(LocalDate.now())) {
                ValidationErrorUtil.addError(errorList, "dateOfBirth", "Date of birth must be in the past");
            }
            if (userCreateRequest.getAddress() == null || userCreateRequest.getAddress().isBlank()) {
                ValidationErrorUtil.addError(errorList, "address", "Address is required");
            }
            if (ValidationErrorUtil.hasErrors(errorList)) {
                throw new ResourceBadRequestException("BAD_REQUEST", errorList);
            }
        } else if (roleEnum == Role.ROLE_TEACHER || roleEnum == Role.ROLE_UNIVERSITY_REP
                || roleEnum == Role.ROLE_COMPANY_MENTOR || roleEnum == Role.ROLE_COMPANY_REP) {
            if (userCreateRequest.getDepartment() == null || userCreateRequest.getDepartment().isBlank()) {
                ValidationErrorUtil.addError(errorList, "department", "Department is required");
            }
            if ((roleEnum == Role.ROLE_TEACHER || roleEnum == Role.ROLE_UNIVERSITY_REP)
                    && (userCreateRequest.getAcademicRank() == null || userCreateRequest.getAcademicRank().isBlank())) {
                ValidationErrorUtil.addError(errorList, "academicRank", "Academic rank is required");
            }
            if ((roleEnum == Role.ROLE_COMPANY_MENTOR || roleEnum == Role.ROLE_COMPANY_REP)
                    && (userCreateRequest.getPosition() == null || userCreateRequest.getPosition().isBlank())) {
                ValidationErrorUtil.addError(errorList, "position", "Position is required");
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

        if (userCreateRequest.getUniversityId() != null) {
            universityRepository.findById(userCreateRequest.getUniversityId()).ifPresent(users::setUniversity);
        }
        if (userCreateRequest.getCompanyId() != null) {
            companyRepository.findById(userCreateRequest.getCompanyId()).ifPresent(users::setCompany);
        }

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
        } else if (roleEnum == Role.ROLE_TEACHER || roleEnum == Role.ROLE_UNIVERSITY_REP
                || roleEnum == Role.ROLE_COMPANY_MENTOR || roleEnum == Role.ROLE_COMPANY_REP) {
            pka.edu.entity.Mentor mentor = new pka.edu.entity.Mentor();
            mentor.setUser(users);
            mentor.setDepartment(userCreateRequest.getDepartment());
            mentor.setAcademicRank(userCreateRequest.getAcademicRank());
            mentor.setPosition(userCreateRequest.getPosition());
            mentorRepository.save(mentor);
        }

        return new ApiResponse<>(UserMapper.toDto(users), true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<UserResponse> updateProfile(Long id, UserUpdateRequest userUpdateRequest)
            throws ResourceConflictException, ResourceNotFoundException, ResourceForbiddenException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        User currentUser = currentUserUtil.getCurrentUser();
        User existingUser = userRepository.findByUserIdAndIsDeletedFalseAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            if (!currentUser.getUserId().equals(id)) {
                if (currentUser.getRole() == Role.ROLE_MENTOR) {
                    if (existingUser.getRole() == Role.ROLE_ADMIN || existingUser.getRole() == Role.ROLE_STUDENT) {
                        throw new ResourceForbiddenException("Mentor cannot update Admin or Student profiles");
                    }
                } else {
                    throw new ResourceForbiddenException("You cannot update other user's profile");
                }
            }
        }

        if (userRepository.existsByUsernameAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(userUpdateRequest.getUsername(),
                id)) {
            errorList.put("username", "Username already exists");
        }

        if (userRepository.existsByEmailAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(userUpdateRequest.getEmail(),
                id)) {
            errorList.put("email", "Email already exists");
        }
        if (ValidationErrorUtil.hasErrors(errorList)) {
            throw new ResourceConflictException("CONFLICT", errorList);
        }

        UserMapper.updateFromDto(existingUser, userUpdateRequest);

        if (userUpdateRequest.getUniversityId() != null) {
            universityRepository.findById(userUpdateRequest.getUniversityId()).ifPresent(existingUser::setUniversity);
        }
        if (userUpdateRequest.getCompanyId() != null) {
            companyRepository.findById(userUpdateRequest.getCompanyId()).ifPresent(existingUser::setCompany);
        }

        userRepository.save(existingUser);

        if (existingUser.getRole() == Role.ROLE_STUDENT) {
            pka.edu.entity.Student student = studentRepository.findById(existingUser.getUserId())
                    .orElse(new pka.edu.entity.Student());
            student.setUser(existingUser);
            if (userUpdateRequest.getStudentCode() != null)
                student.setStudentCode(userUpdateRequest.getStudentCode());
            if (userUpdateRequest.getMajor() != null)
                student.setMajor(userUpdateRequest.getMajor());
            if (userUpdateRequest.getClassRoom() != null)
                student.setClassRoom(userUpdateRequest.getClassRoom());
            if (userUpdateRequest.getDateOfBirth() != null)
                student.setDateOfBirth(userUpdateRequest.getDateOfBirth());
            if (userUpdateRequest.getAddress() != null)
                student.setAddress(userUpdateRequest.getAddress());
            if (userUpdateRequest.getExternalMentorName() != null)
                student.setExternalMentorName(userUpdateRequest.getExternalMentorName());
            if (userUpdateRequest.getExternalMentorPhone() != null)
                student.setExternalMentorPhone(userUpdateRequest.getExternalMentorPhone());
            studentRepository.save(student);
        } else if (existingUser.getRole() == Role.ROLE_TEACHER || existingUser.getRole() == Role.ROLE_UNIVERSITY_REP
                || existingUser.getRole() == Role.ROLE_COMPANY_MENTOR
                || existingUser.getRole() == Role.ROLE_COMPANY_REP) {
            pka.edu.entity.Mentor mentor = mentorRepository.findById(existingUser.getUserId())
                    .orElse(new pka.edu.entity.Mentor());
            mentor.setUser(existingUser);
            if (userUpdateRequest.getDepartment() != null)
                mentor.setDepartment(userUpdateRequest.getDepartment());
            if (userUpdateRequest.getAcademicRank() != null)
                mentor.setAcademicRank(userUpdateRequest.getAcademicRank());
            if (userUpdateRequest.getPosition() != null)
                mentor.setPosition(userUpdateRequest.getPosition());
            mentorRepository.save(mentor);
        }

        return new ApiResponse<>(UserMapper.toDto(existingUser), true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<UserResponse> updateStatus(Long id)
            throws ResourceNotFoundException, ResourceForbiddenException {
        User currentUser = currentUserUtil.getCurrentUser();
        User users = userRepository.findByUserIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (currentUser.getRole() == Role.ROLE_MENTOR) {
            if (users.getRole() == Role.ROLE_ADMIN || users.getRole() == Role.ROLE_STUDENT) {
                throw new ResourceForbiddenException("Mentor cannot update status of Admin or Student");
            }
        }

        users.setActive(!users.isActive());
        userRepository.save(users);
        return new ApiResponse<>(UserMapper.toDto(users), true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<UserResponse> updateRole(Long id, UpdateRoleRequest request)
            throws ResourceNotFoundException, ResourceForbiddenException, ResourceBadRequestException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        User currentUser = currentUserUtil.getCurrentUser();
        User users = userRepository.findByUserIdAndIsDeletedFalseAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (users.getRole() == Role.ROLE_ADMIN) {
            throw new ResourceForbiddenException("Cannot change role of an admin user");
        }

        if (currentUser.getRole() == Role.ROLE_MENTOR) {
            if (users.getRole() == Role.ROLE_STUDENT) {
                throw new ResourceForbiddenException("Mentor cannot update role of Student");
            }
        }
        try {
            Role newRole = Role.valueOf(request.getRole().toUpperCase());
            if (currentUser.getRole() == Role.ROLE_MENTOR) {
                if (newRole == Role.ROLE_ADMIN || newRole == Role.ROLE_STUDENT) {
                    throw new ResourceForbiddenException("Mentor can only assign staff roles");
                }
            }
            Role oldRole = users.getRole();

            if (newRole != oldRole) {
                // Delete old role details
                if (oldRole == Role.ROLE_STUDENT) {
                    studentRepository.findById(users.getUserId()).ifPresent(studentRepository::delete);
                } else if (oldRole == Role.ROLE_TEACHER || oldRole == Role.ROLE_UNIVERSITY_REP
                        || oldRole == Role.ROLE_COMPANY_MENTOR || oldRole == Role.ROLE_COMPANY_REP) {
                    mentorRepository.findById(users.getUserId()).ifPresent(mentorRepository::delete);
                }

                // Create new role details
                users.setRole(newRole);

                // Must save user first so that role change is persisted before cascading or
                // creating related entities
                userRepository.save(users);

                if (newRole == Role.ROLE_STUDENT) {
                    pka.edu.entity.Student newStudent = new pka.edu.entity.Student();
                    newStudent.setUser(users);
                    // Lỗi: Các trường bắt buộc như studentCode đang trống có thể gây
                    // DataIntegrityViolationException.
                    // Tạm thời vô hiệu hóa tài khoản và tạo một mã sinh viên ngẫu nhiên để pass
                    // validation. Admin/User cần update sau.
                    newStudent.setStudentCode("TEMP_STU_" + users.getUserId());
                    users.setActive(false);
                    studentRepository.save(newStudent);
                } else if (newRole == Role.ROLE_TEACHER || newRole == Role.ROLE_UNIVERSITY_REP
                        || newRole == Role.ROLE_COMPANY_MENTOR || newRole == Role.ROLE_COMPANY_REP) {
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
    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<String> deleteProfile(Long id) throws ResourceNotFoundException, ResourceForbiddenException {
        User currentUser = currentUserUtil.getCurrentUser();
        User users = userRepository.findByUserIdAndIsDeletedFalseAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (currentUser.getRole() == Role.ROLE_MENTOR) {
            if (users.getRole() == Role.ROLE_ADMIN || users.getRole() == Role.ROLE_STUDENT) {
                throw new ResourceForbiddenException("Mentor cannot delete Admin or Student");
            }
        }

        users.setDeleted(true);
        users.setActive(false);
        userRepository.save(users);
        return new ApiResponse<>("User deleted successfully", true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
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
    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<String> uploadAvatar(Long userId, MultipartFile file)
            throws ResourceNotFoundException, IOException, ResourceForbiddenException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        User currentUser = currentUserUtil.getCurrentUser();
        if (currentUser.getRole() != Role.ROLE_ADMIN && !currentUser.getUserId().equals(userId)) {
            throw new ResourceForbiddenException("You do not have permission to upload avatar for this user");
        }

        String avatarUrl = fileUploadService.uploadFile(file);

        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);

        return new ApiResponse<>(avatarUrl, true, "Upload avatar successfully", null, LocalDateTime.now());
    }
}
