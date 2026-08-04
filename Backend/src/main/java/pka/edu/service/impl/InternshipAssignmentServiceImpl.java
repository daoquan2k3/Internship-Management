package pka.edu.service.impl;

import pka.edu.dto.request.InternshipAssignmentCreateRequest;
import pka.edu.dto.request.InternshipAssignmentUpdateRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.InternshipAssignmentResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.entity.*;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.mapper.InternshipAssignmentMapper;
import pka.edu.repository.MentorRepository;
import pka.edu.repository.StudentRepository;
import pka.edu.repository.InternshipAssignmentRepository;

import pka.edu.repository.InternshipPlacementRepository;
import pka.edu.service.InternshipAssignmentService;
import pka.edu.util.CurrentUserUtil;
import pka.edu.util.PaginationUtil;
import pka.edu.util.ValidationErrorUtil;
import pka.edu.util.enums.AssignmentStatus;
import pka.edu.util.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class InternshipAssignmentServiceImpl implements InternshipAssignmentService {
    private final InternshipAssignmentRepository internshipAssignmentRepository;
    private final MentorRepository MentorRepository;
    private final StudentRepository StudentRepository;
    private final InternshipPlacementRepository internshipPlacementRepository;
    private final CurrentUserUtil currentUserUtil;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<InternshipAssignmentResponse> createInternshipAssignment(InternshipAssignmentCreateRequest request) throws ResourceNotFoundException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();


        Mentor mentor = MentorRepository.findByMentorId(request.getMentorId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found with id: " + request.getMentorId()));

        User currentUser = currentUserUtil.getCurrentUser();
        if (currentUser.getRole() == pka.edu.util.enums.Role.ROLE_COMPANY_REP) {
            if (currentUser.getCompany() == null || mentor.getUser().getCompany() == null ||
                !currentUser.getCompany().getCompanyId().equals(mentor.getUser().getCompany().getCompanyId())) {
                throw new ResourceConflictException("You can only assign to mentors in your company");
            }
        }

        Set<Long> uniqueStudentIds = new HashSet<>(request.getStudentIds());
        if (uniqueStudentIds.size() != request.getStudentIds().size()) {
            errorList.put("studentIds", "Has duplicate student IDs in the request");
            throw new ResourceConflictException("Validation failed", errorList);
        }

        List<Student> studentList = StudentRepository.findAllByStudentId(request.getStudentIds());
        if (studentList.size() != request.getStudentIds().size()) {
            throw new ResourceNotFoundException("One or more students not found with the provided IDs");
        }

        // THAY ĐỔI: Chỉ tạo ra 1 Object Đề tài (Assignment) duy nhất, chứa tất cả sinh viên
        InternshipAssignment assignment = InternshipAssignmentMapper.toEntity(request, studentList, mentor);
        assignment.setStatus(AssignmentStatus.IN_PROGRESS);
        InternshipAssignment savedAssignment = internshipAssignmentRepository.save(assignment);

        // Đồng bộ Mentor sang Phân bổ thực tập (InternshipPlacement)
        for (Student student : studentList) {
            java.util.List<InternshipPlacement> placements = internshipPlacementRepository.findAllByStudent_StudentId(student.getStudentId());
            for (InternshipPlacement placement : placements) {
                placement.setMentor(mentor);
                internshipPlacementRepository.save(placement);
            }
        }

        return new ApiResponse<>(
                InternshipAssignmentMapper.toDto(savedAssignment),
                true,
                "Internship assignment created successfully",
                null,
                LocalDateTime.now());
    }

    @Override
    public PageResponseDTO<InternshipAssignmentResponse> getAllInternshipAssignment(String search, PageRequestDTO pageRequestDTO) throws ResourceNotFoundException, ResourceForbiddenException {
        User user = currentUserUtil.getCurrentUser();
        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "internshipAssignment");
        Page<InternshipAssignment> internshipAssignmentPage;

        if (user.getRole() == Role.ROLE_ADMIN) {
            internshipAssignmentPage = internshipAssignmentRepository.findAllByKeyword(search, pageable);
        } else if (user.getRole() == Role.ROLE_MENTOR) {
            // Thay đổi hàm gọi Repository
            internshipAssignmentPage = internshipAssignmentRepository.findByMentorIdAndKeyword(search, user.getMentor().getMentorId(), pageable);
        } else if (user.getRole() == Role.ROLE_STUDENT) {
            // Thay đổi hàm gọi Repository
            internshipAssignmentPage = internshipAssignmentRepository.findByStudentIdAndKeyword(search, user.getStudent().getStudentId(), pageable);
        } else if (user.getRole() == Role.ROLE_COMPANY_REP && user.getCompany() != null) {
            internshipAssignmentPage = internshipAssignmentRepository.findByCompanyIdAndKeyword(search, user.getCompany().getCompanyId(), pageable);
        } else {
            throw new ResourceForbiddenException("User does not have permission to access internship assignments");
        }

        return PaginationUtil.toPageResponseDTO(internshipAssignmentPage, InternshipAssignmentMapper::toDto);
    }

    @Override
    public ApiResponse<InternshipAssignmentResponse> getInternshipAssignmentById(Long internshipAssignmentId) throws ResourceNotFoundException, ResourceForbiddenException {
        User user = currentUserUtil.getCurrentUser();

        if (user.getRole() == Role.ROLE_ADMIN) {
            InternshipAssignment internshipAssignment = internshipAssignmentRepository.findById(internshipAssignmentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Internship assignment not found with id: " + internshipAssignmentId));
            return new ApiResponse<>(InternshipAssignmentMapper.toDto(internshipAssignment), true, "Get internshipAssignment by id successfully", null, LocalDateTime.now());
        } else if (user.getRole() == Role.ROLE_MENTOR) {
            InternshipAssignment internshipAssignment = internshipAssignmentRepository.findByAssignmentIdAndMentor_MentorId(internshipAssignmentId, user.getMentor().getMentorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Internship assignment not found with id: " + internshipAssignmentId));
            return new ApiResponse<>(InternshipAssignmentMapper.toDto(internshipAssignment), true, "Get internshipAssignment by id successfully", null, LocalDateTime.now());
        } else if (user.getRole() == Role.ROLE_STUDENT) {
            // Thay đổi hàm gọi Repository
            InternshipAssignment internshipAssignment = internshipAssignmentRepository.findByAssignmentIdAndStudentId(internshipAssignmentId, user.getStudent().getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Internship assignment not found with id: " + internshipAssignmentId));
            return new ApiResponse<>(InternshipAssignmentMapper.toDto(internshipAssignment), true, "Get internshipAssignment by id successfully", null, LocalDateTime.now());
        } else if (user.getRole() == Role.ROLE_COMPANY_REP && user.getCompany() != null) {
            InternshipAssignment internshipAssignment = internshipAssignmentRepository.findByAssignmentIdAndMentor_User_Company_CompanyId(internshipAssignmentId, user.getCompany().getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Internship assignment not found with id: " + internshipAssignmentId));
            return new ApiResponse<>(InternshipAssignmentMapper.toDto(internshipAssignment), true, "Get internshipAssignment by id successfully", null, LocalDateTime.now());
        } else {
            throw new ResourceForbiddenException("User does not have permission to access internship assignment");
        }
    }

    @Override
    public ApiResponse<InternshipAssignmentResponse> updateInternshipAssignment(Long internshipAssignmentId, InternshipAssignmentUpdateRequest request) throws ResourceNotFoundException, ResourceBadRequestException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        InternshipAssignment internshipAssignment = internshipAssignmentRepository.findById(internshipAssignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship assignment not found with id: " + internshipAssignmentId));
        if (request.getStatus() != null) {
            try {
                internshipAssignment.setStatus(AssignmentStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                ValidationErrorUtil.addError(errorList, "status", "Invalid status value");
                throw new ResourceBadRequestException("Validation failed", errorList);
            }
        }
        if (request.getAssignmentTitle() != null) {
            internshipAssignment.setAssignmentTitle(request.getAssignmentTitle());
        }
        if (request.getAssignmentDescription() != null) {
            internshipAssignment.setAssignmentDescription(request.getAssignmentDescription());
        }

        if (request.getDueDate() != null) {
            internshipAssignment.setDueDate(request.getDueDate());
        }

        if (request.getMentorId() != null && !request.getMentorId().equals(internshipAssignment.getMentor().getMentorId())) {
            Mentor mentor = MentorRepository.findByMentorId(request.getMentorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Mentor not found with id: " + request.getMentorId()));
                    
            User currentUser = currentUserUtil.getCurrentUser();
            if (currentUser.getRole() == pka.edu.util.enums.Role.ROLE_COMPANY_REP) {
                if (currentUser.getCompany() == null || mentor.getUser().getCompany() == null ||
                    !currentUser.getCompany().getCompanyId().equals(mentor.getUser().getCompany().getCompanyId())) {
                    Map<String, String> err = ValidationErrorUtil.createErrorMap();
                    ValidationErrorUtil.addError(err, "mentorId", "You can only assign to mentors in your company");
                    throw new ResourceBadRequestException("Validation failed", err);
                }
            }
            internshipAssignment.setMentor(mentor);

            // Cập nhật mentor trong Placement cho các sinh viên của Assignment
            for (Student student : internshipAssignment.getStudents()) {
                java.util.List<InternshipPlacement> placements = internshipPlacementRepository.findAllByStudent_StudentId(student.getStudentId());
                for (InternshipPlacement placement : placements) {
                    placement.setMentor(mentor);
                    internshipPlacementRepository.save(placement);
                }
            }
        }

        if (request.getStudentIds() != null) {
            List<Student> newStudentList = StudentRepository.findAllByStudentId(request.getStudentIds());

            if (newStudentList.size() != request.getStudentIds().size()) {
                throw new ResourceNotFoundException("One or more students not found with the provided IDs");
            }

            internshipAssignment.setStudents(newStudentList);
            
            // Cập nhật mentor trong Placement cho danh sách sinh viên mới
            for (Student student : newStudentList) {
                java.util.List<InternshipPlacement> placements = internshipPlacementRepository.findAllByStudent_StudentId(student.getStudentId());
                for (InternshipPlacement placement : placements) {
                    placement.setMentor(internshipAssignment.getMentor());
                    internshipPlacementRepository.save(placement);
                }
            }
        }
        internshipAssignmentRepository.save(internshipAssignment);
        return new ApiResponse<>(
                InternshipAssignmentMapper.toDto(internshipAssignment),
                true,
                "Internship assignment updated status successfully",
                null,
                LocalDateTime.now());
    }

}
