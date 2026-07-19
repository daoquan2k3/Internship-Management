package pka.edu.service.impl;

import pka.edu.dto.request.*;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.AssessmentResultResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.entity.*;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.mapper.AssessmentResultMapper;
import pka.edu.repository.*;
import pka.edu.service.IAssessmentResultService;
import pka.edu.util.CurrentUserUtil;
import pka.edu.util.PaginationUtil;
import pka.edu.util.ValidationErrorUtil;
import pka.edu.util.enums.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssessmentResultServiceImpl implements IAssessmentResultService {
    private final IAssessmentResultRepository assessmentResultRepository;
    private final InternshipAssignmentRepository internshipAssignmentRepository;
    private final IAssessmentRoundsRepository iAssessmentRoundsRepository;
    private final IEvaluationCriteriaRepository iEvaluationCriteriaRepository;
    private final CurrentUserUtil currentUserUtil;
    private final IRoundCriteriaRepository iRoundCriteriaRepository;
    private final IUserRepository iUserRepository;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<List<AssessmentResultResponse>> createAssessmentResult(AssessmentResultCreateRequest request) throws ResourceNotFoundException, ResourceForbiddenException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        InternshipAssignment assignment = internshipAssignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Internship assignment not found with id: " + request.getAssignmentId()));

        AssessmentRound round = iAssessmentRoundsRepository.findByRoundIdAndIsDeletedFalse(request.getRoundId())
                .orElseThrow(() -> new ResourceNotFoundException("Assessment round not found with id: " + request.getRoundId()));


        User user = currentUserUtil.getCurrentUser();

        if (!internshipAssignmentRepository.existsByMentor_MentorIdAndAssignmentId(user.getMentor().getMentorId(), assignment.getAssignmentId())) {
            throw new ResourceForbiddenException("You do not have permission to create assessment results for this assignment");
        }

        if (!assignment.getPhase().getPhaseId().equals(round.getPhase().getPhaseId())) {
            errorList.put("roundId", "Round does not belong to the assignment's phase");
        }

        Set<Long> uniqueCriteriaIds = new HashSet<>();

        List<AssessmentResult> assessmentResultList = request.getResults().stream()
                .map(req -> {
                    EvaluationCriteria criteria = null;
                    try {
                        criteria = iRoundCriteriaRepository.findByCriterionId(req.getCriterionId(), round.getRoundId())
                                .orElseThrow(() -> new ResourceNotFoundException("Evaluation criteria not found with id: " + req.getCriterionId()));
                    } catch (ResourceNotFoundException e) {
                        throw new RuntimeException(e);
                    }

                    if (!uniqueCriteriaIds.add(req.getCriterionId())) {
                        ValidationErrorUtil.addError(errorList, "criterionIds", "Has duplicate criterion IDs in the request");
                        throw new RuntimeException(new ResourceConflictException("Validation failed", errorList));
                    }

                    if (assessmentResultRepository.existsByAssignmentAndRoundAndCriterion(
                            assignment.getAssignmentId(),
                            round.getRoundId(),
                            criteria.getCriterionId())) {
                        ValidationErrorUtil.addError(errorList, "criterionIds", "This criteria has id " + req.getCriterionId() + " already been evaluated for this assignment");
                        throw new RuntimeException(new ResourceConflictException("Validation failed", errorList));
                    }
                    if (req.getScore().compareTo(BigDecimal.ZERO) < 0 || req.getScore().compareTo(criteria.getMaxScore()) > 0) {
                        ValidationErrorUtil.addError(errorList, "score", "Score for criterion ID " + req.getCriterionId() + " must be between 0 and " + criteria.getMaxScore());
                        throw new RuntimeException(new ResourceConflictException("Validation failed", errorList));
                    }

                    return AssessmentResult.builder()
                            .assignment(assignment)
                            .round(round)
                            .criterion(criteria)
                            .score(req.getScore())
                            .comment(req.getComments())
                            .evaluationId(user)
                            .evaluationDate(LocalDateTime.now().toLocalDate())
                            .build();
                }).toList();

        if (ValidationErrorUtil.hasErrors(errorList)) {
            throw new ResourceConflictException("Validation failed", errorList);
        }

        assessmentResultRepository.saveAll(assessmentResultList);

        List<AssessmentResultResponse> responses = assessmentResultList.stream()
                .map(AssessmentResultMapper::toDTO)
                .toList();

        return new ApiResponse<>(
                responses,
                true,
                "Assessment results created successfully",
                null,
                LocalDateTime.now()
        );
    }

    @Override
    public PageResponseDTO<AssessmentResultResponse> getAllAssessmentResult(String search, Long assignmentId, PageRequestDTO requestDTO) throws ResourceNotFoundException, ResourceForbiddenException {

        Pageable pageable = PaginationUtil.createPageRequest(requestDTO, "assessmentResult");
        Page<AssessmentResult> assessmentResultPage;

        User user = currentUserUtil.getCurrentUser();

        if (user.getRole() == Role.ROLE_ADMIN) {
            if (assignmentId != null) {
                assessmentResultPage = assessmentResultRepository.findAllByAssignment_AssignmentId(assignmentId, search, pageable);
            } else {
                assessmentResultPage = assessmentResultRepository.searchAllAssessmentResults(search, pageable);
            }
        } else if (user.getRole() == Role.ROLE_MENTOR) {
            if (assignmentId != null) {
                if (!internshipAssignmentRepository.existsByMentor_MentorIdAndAssignmentId(user.getMentor().getMentorId(), assignmentId)) {
                    throw new ResourceForbiddenException("Mentor does not have permission to view assessment results for this assignment");
                }
                assessmentResultPage = assessmentResultRepository.findAllByAssignment_AssignmentIdAndEvaluationId_UserId(assignmentId, search, user.getUserId(), pageable);
            } else {
                assessmentResultPage = assessmentResultRepository.searchByMentorId(user.getMentor().getMentorId(), search, pageable);
            }

        } else if (user.getRole() == Role.ROLE_STUDENT) {
            if (assignmentId != null) {
                if (!internshipAssignmentRepository.existsByStudentIdAndAssignmentId(user.getStudent().getStudentId(), assignmentId)) {
                    throw new ResourceForbiddenException("Student does not have permission to view assessment results for this assignment");
                }
                assessmentResultPage = assessmentResultRepository.findAllByAssignment_AssignmentId(assignmentId, search, pageable);
            } else {
                assessmentResultPage = assessmentResultRepository.findAllByAssignment_Student_StudentId(user.getStudent().getStudentId(), search, pageable);
            }
        } else {
            throw new ResourceForbiddenException("User does not have permission to view assessment results");
        }

        return PaginationUtil.toPageResponseDTO(assessmentResultPage, AssessmentResultMapper::toDTO);
    }

    @Override
    public ApiResponse<AssessmentResultResponse> updateAssessmentResult(Long id, AssessmentResultUpdateRequest request) throws ResourceNotFoundException, ResourceForbiddenException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        AssessmentResult assessmentResult = assessmentResultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment result not found with id: " + id));

        User user = currentUserUtil.getCurrentUser();

        if (!assessmentResultRepository.existsByResultIdAndEvaluationId_UserId(id, user.getMentor().getMentorId())) {
            throw new ResourceForbiddenException("You do not have permission to update this assessment result");
        }
        EvaluationCriteria criteria = iEvaluationCriteriaRepository.findById(assessmentResult.getCriterion().getCriterionId())
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation criteria not found with id: " + assessmentResult.getCriterion().getCriterionId()));

        if (request.getScore() != null && (request.getScore().compareTo(BigDecimal.ZERO) < 0 || request.getScore().compareTo(criteria.getMaxScore()) > 0)) {
            throw new ResourceConflictException("Score must be between 0 and " + criteria.getMaxScore(), errorList);
        }
        if (ValidationErrorUtil.hasErrors(errorList)) {
            throw new ResourceConflictException("Validation failed", errorList);
        }

        AssessmentResultMapper.updateFromDto(assessmentResult, request);
        assessmentResultRepository.save(assessmentResult);

        return new ApiResponse<>(
                AssessmentResultMapper.toDTO(assessmentResult),
                true,
                "Assessment result updated successfully",
                null,
                LocalDateTime.now()
        );
    }

    @Override
    public ApiResponse<AssessmentResultResponse> getAssessmentResultById(Long resultId) throws ResourceNotFoundException {
        AssessmentResult result = assessmentResultRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment result not found with id: " + resultId));
        return new ApiResponse<>(AssessmentResultMapper.toDTO(result), true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveBulkGrades(BulkAssessmentSaveRequest request) throws ResourceNotFoundException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        User currentUser = currentUserUtil.getCurrentUser();

        InternshipAssignment assignment = internshipAssignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phân công ID: " + request.getAssignmentId()));

        AssessmentRound round = iAssessmentRoundsRepository.findById(request.getRoundId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vòng đánh giá ID: " + request.getRoundId()));

        EvaluationCriteria criterion = iEvaluationCriteriaRepository.findById(request.getCriterionId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tiêu chí đánh giá ID: " + request.getCriterionId()));

        List<AssessmentResult> resultsToSave = new ArrayList<>();

        for (StudentEvaluationRequest eval : request.getEvaluations()) {

            User student = iUserRepository.findById(eval.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sinh viên ID: " + eval.getStudentId()));

            AssessmentResult result = assessmentResultRepository
                    .findByAssignment_AssignmentIdAndStudent_StudentIdAndRound_RoundIdAndCriterion_CriterionId(
                            assignment.getAssignmentId(), student.getStudent().getStudentId(), round.getRoundId(), criterion.getCriterionId()
                    ).orElse(new AssessmentResult());
            if (eval.getScore() != null && (eval.getScore().compareTo(BigDecimal.ZERO) < 0 || eval.getScore().compareTo(criterion.getMaxScore()) > 0)) {
                throw new ResourceConflictException("Điểm số cho sinh viên ID: " + eval.getStudentId() + " phải nằm trong khoảng từ 0 đến " + criterion.getMaxScore(), errorList);
            }

            result.setAssignment(assignment);
            result.setStudent(student.getStudent());
            result.setRound(round);
            result.setCriterion(criterion);
            result.setScore(eval.getScore() != null ? eval.getScore() : BigDecimal.ZERO);
            result.setContribution(eval.getContribution());
            result.setComment(eval.getComment());
            result.setEvaluationId(currentUser);
            result.setEvaluationDate(LocalDate.now());

            resultsToSave.add(result);
        }
        if (ValidationErrorUtil.hasErrors(errorList)) {
            throw new ResourceConflictException("Validation failed", errorList);
        }

        assessmentResultRepository.saveAll(resultsToSave);
    }
}
