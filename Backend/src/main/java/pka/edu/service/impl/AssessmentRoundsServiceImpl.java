package pka.edu.service.impl;

import pka.edu.dto.request.AssessmentRoundCreateRequest;
import pka.edu.dto.request.AssessmentRoundUpdateRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.AssessmentRoundsResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.entity.AssessmentRound;

import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.repository.AssessmentRoundsRepository;
import pka.edu.mapper.AssessmentRoundsMapper;
import pka.edu.service.IAssessmentRoundsService;
import pka.edu.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import pka.edu.repository.UniversityClassRepository;
import pka.edu.entity.UniversityClass;
import pka.edu.entity.User;
import pka.edu.util.CurrentUserUtil;
import pka.edu.util.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pka.edu.exception.ResourceForbiddenException;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AssessmentRoundsServiceImpl implements IAssessmentRoundsService {

    private final AssessmentRoundsRepository assessmentRoundsRepository;
    private final UniversityClassRepository universityClassRepository;
    private final CurrentUserUtil currentUserUtil;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<AssessmentRoundsResponse> createAssessmentRound(AssessmentRoundCreateRequest request)
            throws ResourceNotFoundException, ResourceConflictException, ResourceForbiddenException {

        UniversityClass universityClass = null;
        if (request.getClassId() != null) {
            universityClass = universityClassRepository.findById(request.getClassId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));
        }

        User currentUser = currentUserUtil.getCurrentUser();
        if (currentUser.getRole() == Role.ROLE_TEACHER) {
            if (universityClass == null) {
                throw new ResourceForbiddenException("Teacher must specify a class for the assessment round");
            }
            if (!currentUser.getUserId().equals(universityClass.getTeacher().getUserId())) {
                throw new ResourceForbiddenException(
                        "Teacher can only create assessment rounds for their assigned class");
            }
        } else if (currentUser.getRole() == Role.ROLE_UNIVERSITY_REP) {
            if (universityClass != null
                    && !currentUser.getUserId().equals(universityClass.getUniversity().getUniversityId())) {
                throw new ResourceForbiddenException(
                        "University Rep can only create assessment rounds for their own classes");
            }
        }

        AssessmentRound assessmentRounds = AssessmentRoundsMapper.toEntity(request, universityClass);

        assessmentRoundsRepository.save(assessmentRounds);
        return new ApiResponse<>(
                AssessmentRoundsMapper.toDto(assessmentRounds),
                true,
                "Assessment round created successfully",
                null,
                LocalDateTime.now());
    }

    @Override
    public PageResponseDTO<AssessmentRoundsResponse> getAllAssessmentRound(String search, Long classId,
            PageRequestDTO pageRequestDTO) {
        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "assessmentRound");

        Page<AssessmentRound> assessmentRoundsPage;

        User currentUser = currentUserUtil.getCurrentUser();
        boolean isTeacher = currentUser.getRole() == Role.ROLE_TEACHER;
        Long teacherId = currentUser.getUserId();

        if (classId != null && classId != 0) {
            assessmentRoundsPage = assessmentRoundsRepository.findAllByUniversityClass_ClassId(classId, pageable);
        } else if (isTeacher) {
            if (search != null && !search.isBlank()) {
                assessmentRoundsPage = assessmentRoundsRepository.findAllByKeywordAndTeacherId(search, teacherId,
                        pageable);
            } else {
                assessmentRoundsPage = assessmentRoundsRepository.findAllByTeacherId(teacherId, pageable);
            }
        } else if (currentUser.getRole() == Role.ROLE_UNIVERSITY_REP && currentUser.getUniversity() != null) {
            Long universityId = currentUser.getUniversity().getUniversityId();
            if (search != null && !search.isBlank()) {
                assessmentRoundsPage = assessmentRoundsRepository.findAllByKeywordAndUniversityId(search, universityId,
                        pageable);
            } else {
                assessmentRoundsPage = assessmentRoundsRepository.findAllByUniversityId(universityId, pageable);
            }
        } else if (search != null && !search.isBlank()) {
            assessmentRoundsPage = assessmentRoundsRepository.findAllByKeyword(search, pageable);
        } else {
            assessmentRoundsPage = assessmentRoundsRepository.findAll(pageable);
        }
        return PaginationUtil.toPageResponseDTO(assessmentRoundsPage, AssessmentRoundsMapper::toDto);
    }

    @Override
    public ApiResponse<AssessmentRoundsResponse> getAssessmentRoundById(Long id) throws ResourceNotFoundException {
        AssessmentRound assessmentRound = assessmentRoundsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment round not found with id: " + id));

        return new ApiResponse<>(AssessmentRoundsMapper.toDto(assessmentRound),
                true,
                "Get assessment round with id: " + id + " successfully",
                null,
                LocalDateTime.now());
    }

    @Override
    public ApiResponse<AssessmentRoundsResponse> updateAssessmentRound(Long id, AssessmentRoundUpdateRequest request)
            throws ResourceNotFoundException, ResourceConflictException, ResourceBadRequestException,
            ResourceForbiddenException {
        AssessmentRound assessmentRound = assessmentRoundsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment round not found with id: " + id));

        User currentUser = currentUserUtil.getCurrentUser();
        if (currentUser.getRole() == Role.ROLE_TEACHER) {
            if (assessmentRound.getUniversityClass() == null
                    || !currentUser.getUserId().equals(assessmentRound.getUniversityClass().getTeacher().getUserId())) {
                throw new ResourceForbiddenException(
                        "Teacher can only update assessment rounds for their assigned class");
            }
        } else if (currentUser.getRole() == Role.ROLE_UNIVERSITY_REP) {
            if (assessmentRound.getUniversityClass() != null
                    && (currentUser.getUniversity() == null || !currentUser.getUniversity().getUniversityId()
                            .equals(assessmentRound.getUniversityClass().getUniversity().getUniversityId()))) {
                throw new ResourceForbiddenException(
                        "University Rep can only update assessment rounds for their own classes");
            }
        }

        AssessmentRoundsMapper.updateFromDto(assessmentRound, request);

        assessmentRoundsRepository.save(assessmentRound);
        return new ApiResponse<>(AssessmentRoundsMapper.toDto(assessmentRound),
                true,
                "Update assessment round successfully",
                null,
                LocalDateTime.now());
    }

    @Override
    public ApiResponse<String> deleteAssessmentRound(Long id)
            throws ResourceNotFoundException, ResourceForbiddenException {
        AssessmentRound assessmentRound = assessmentRoundsRepository.findByRoundIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment round not found with id: " + id));
        User currentUser = currentUserUtil.getCurrentUser();
        if (currentUser.getRole() == Role.ROLE_TEACHER) {
            if (assessmentRound.getUniversityClass() == null
                    || !currentUser.getUserId().equals(assessmentRound.getUniversityClass().getTeacher().getUserId())) {
                throw new ResourceForbiddenException(
                        "Teacher can only delete assessment rounds for their assigned class");
            }
        } else if (currentUser.getRole() == Role.ROLE_UNIVERSITY_REP) {
            if (assessmentRound.getUniversityClass() != null
                    && (currentUser.getUniversity() == null || !currentUser.getUniversity().getUniversityId()
                            .equals(assessmentRound.getUniversityClass().getUniversity().getUniversityId()))) {
                throw new ResourceForbiddenException(
                        "University Rep can only delete assessment rounds for their own classes");
            }
        }
        assessmentRound.setDeleted(true);
        assessmentRound.setIsActive(false);
        assessmentRoundsRepository.save(assessmentRound);
        return new ApiResponse<>(
                "Assessment round with id: " + id + " has been deleted successfully",
                true,
                "SUCCESS",
                null,
                LocalDateTime.now());
    }
}
