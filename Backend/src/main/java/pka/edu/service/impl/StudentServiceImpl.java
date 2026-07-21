package pka.edu.service.impl;

import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.request.StudentCreateRequest;
import pka.edu.dto.request.StudentUpdateRequest;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.dto.response.StudentResponse;
import pka.edu.entity.Student;
import pka.edu.entity.User;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.mapper.StudentMapper;
import pka.edu.repository.IStudentRepository;
import pka.edu.repository.IUserRepository;
import pka.edu.repository.InternshipAssignmentRepository;
import pka.edu.service.IStudentService;
import pka.edu.util.CurrentUserUtil;
import pka.edu.util.PaginationUtil;
import pka.edu.util.ValidationErrorUtil;
import pka.edu.util.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements IStudentService {
    private final IStudentRepository studentRepository;
    private final IUserRepository iUserRepository;
    private final InternshipAssignmentRepository internshipAssignmentRepository;
    private final CurrentUserUtil currentUserUtil;

    @Override
    public ApiResponse<StudentResponse> createStudent(StudentCreateRequest request) throws ResourceNotFoundException, ResourceBadRequestException, ResourceForbiddenException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        User user = iUserRepository.findByUserIdAndIsDeletedFalseAndIsActiveTrue(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        if (studentRepository.existsByStudentCode(request.getStudentCode())) {
            errorList.put("studentCode", "Student code already exists");
            throw new ResourceConflictException("Validation failed", errorList);
        }

        if (user.getRole() != Role.ROLE_STUDENT) {
            throw new ResourceForbiddenException("User with id: " + request.getUserId() + " does not have STUDENT role");
        }
        
        if (studentRepository.existsById(request.getUserId())) {
            errorList.put("userId", "Student with this user ID already exists");
            throw new ResourceConflictException("Validation failed", errorList);
        }

        Student student = new Student();
        student.setUser(user);
        StudentMapper.toEntity(student, request);
        studentRepository.save(student);

        return new ApiResponse<>(
                StudentMapper.toDto(student),
                true,
                "Student created successfully",
                null,
                LocalDateTime.now()
        );
    }

    @Override
    public PageResponseDTO<StudentResponse> getAllStudent(PageRequestDTO pageRequestDTO, String search) throws ResourceForbiddenException {

        User currentUser = currentUserUtil.getCurrentUser();
        Page<Student> studentPage;

        if (currentUser.getRole() == Role.ROLE_ADMIN) {
            Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "student");
            studentPage = studentRepository.findAllStudentsWithSearch(search, pageable);
        } else if (currentUser.getRole() == Role.ROLE_MENTOR) {
            Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "student");
            studentPage = internshipAssignmentRepository.findStudentsByMentorIdWithSearch(currentUser.getUserId(), search, pageable);
        } else {
            throw new ResourceForbiddenException("Current user does not have permission to view students");
        }
        return PaginationUtil.toPageResponseDTO(studentPage, StudentMapper::toDto);
    }

    @Override
    public ApiResponse<StudentResponse> getCurrentStudentInfo() throws ResourceNotFoundException, ResourceForbiddenException {
        User currentUser = currentUserUtil.getCurrentUser();
        if (currentUser.getRole() != Role.ROLE_STUDENT) {
            throw new ResourceForbiddenException("Only students can access this endpoint");
        }

        Student student = studentRepository.findByUser_UserId(currentUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for current user"));

        return new ApiResponse<>(
                StudentMapper.toDto(student),
                true,
                "Current student info retrieved successfully",
                null,
                LocalDateTime.now()
        );
    }

    @Override
    public ApiResponse<StudentResponse> getStudentById(Long id) throws ResourceNotFoundException, ResourceForbiddenException {
        User user = currentUserUtil.getCurrentUser();

        if (user.getRole() == Role.ROLE_ADMIN || user.getRole() == Role.ROLE_MENTOR) {
            Student student = studentRepository.findByStudentId(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
            return new ApiResponse<>(StudentMapper.toDto(student), true, "Student found", null, LocalDateTime.now());
        }else if (user.getRole() == Role.ROLE_STUDENT) {
            Student student = studentRepository.findByStudentId(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
            if (!student.getUser().getUserId().equals(user.getUserId())) {
                throw new ResourceForbiddenException("You cannot view other student's information");
            }
            return new ApiResponse<>(StudentMapper.toDto(student), true, "Student found", null, LocalDateTime.now());
        } else {
            throw new ResourceForbiddenException("Current user does not have permission to view students");
        }
    }

    @Override
    public ApiResponse<StudentResponse> updateStudent(Long id, StudentUpdateRequest request) throws ResourceNotFoundException, ResourceBadRequestException, ResourceForbiddenException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        User currentUser = currentUserUtil.getCurrentUser();

        if (currentUser.getRole() == Role.ROLE_ADMIN){
            Student existingStudent = studentRepository.findByStudentId(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
            if (iUserRepository.existsByEmailAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(request.getEmail(), existingStudent.getUser().getUserId())) {
                ValidationErrorUtil.addError(errorList, "email", "Email already exists");
            }

            if (studentRepository.existsByStudentCodeAndStudentIdNot(request.getStudentCode(), id)) {
                ValidationErrorUtil.addError(errorList, "studentCode", "Student code already exists");
            }
            if (ValidationErrorUtil.hasErrors(errorList)) {
                throw new ResourceConflictException("Validation failed", errorList);
            }

            StudentMapper.updateFromDto(existingStudent, request);
            studentRepository.save(existingStudent);
            return new ApiResponse<>(
                    StudentMapper.toDto(existingStudent),
                    true,
                    "Student updated successfully",
                    null,
                    LocalDateTime.now());
        } else if (currentUser.getRole() == Role.ROLE_STUDENT) {
            Student existingStudent = studentRepository.findById(id).orElseThrow(
                    () -> new ResourceNotFoundException("Student not found with id: " + id)
            );
            if (!existingStudent.getUser().getUserId().equals(currentUser.getUserId())){
                throw new ResourceForbiddenException("You cannot update other student's information");
            }

            if (iUserRepository.existsByEmailAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(request.getEmail(), existingStudent.getUser().getUserId())) {
                ValidationErrorUtil.addError(errorList, "email", "Email already exists");
            }

            if (studentRepository.existsByStudentCodeAndStudentIdNot(request.getStudentCode(), id)) {
                ValidationErrorUtil.addError(errorList, "studentCode", "Student code already exists");
            }
            if (ValidationErrorUtil.hasErrors(errorList)) {
                throw new ResourceConflictException("Validation failed", errorList);
            }

            StudentMapper.updateFromDto(existingStudent, request);
            studentRepository.save(existingStudent);
            return new ApiResponse<>(
                    StudentMapper.toDto(existingStudent),
                    true,
                    "Student updated successfully",
                    null,
                    LocalDateTime.now()
            );
        }else {
            throw new ResourceForbiddenException("Current user does not have permission to update students");
        }
    }
}
