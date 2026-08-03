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
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import pka.edu.event.NotificationEventDTO;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssessmentResultServiceImpl implements IAssessmentResultService {
    private final AssessmentResultRepository assessmentResultRepository;
    private final InternshipAssignmentRepository internshipAssignmentRepository;
    private final AssessmentRoundsRepository AssessmentRoundsRepository;
    private final CurrentUserUtil currentUserUtil;
    private final UserRepository UserRepository;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.key.notification}")
    private String routingKey;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<AssessmentResultResponse> createAssessmentResult(AssessmentResultCreateRequest request) throws ResourceNotFoundException, ResourceForbiddenException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        InternshipAssignment assignment = internshipAssignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Internship assignment not found with id: " + request.getAssignmentId()));

        AssessmentRound round = AssessmentRoundsRepository.findByRoundIdAndIsDeletedFalse(request.getRoundId())
                .orElseThrow(() -> new ResourceNotFoundException("Assessment round not found with id: " + request.getRoundId()));

        User user = currentUserUtil.getCurrentUser();

        if (!internshipAssignmentRepository.existsByMentor_MentorIdAndAssignmentId(user.getMentor().getMentorId(), assignment.getAssignmentId())) {
            throw new ResourceForbiddenException("You do not have permission to create assessment results for this assignment");
        }

        if (!assignment.getPhase().getPhaseId().equals(round.getPhase().getPhaseId())) {
            errorList.put("roundId", "Round does not belong to the assignment's phase");
        }

        if (assessmentResultRepository.existsByAssignment_AssignmentIdAndRound_RoundId(assignment.getAssignmentId(), round.getRoundId())) {
            ValidationErrorUtil.addError(errorList, "roundId", "This assignment has already been evaluated for this round");
            throw new RuntimeException(new ResourceConflictException("Validation failed", errorList));
        }

        if (request.getScore().compareTo(BigDecimal.ZERO) < 0 || request.getScore().compareTo(new BigDecimal("10")) > 0) {
            ValidationErrorUtil.addError(errorList, "score", "Score must be between 0 and 10");
            throw new RuntimeException(new ResourceConflictException("Validation failed", errorList));
        }

        if (ValidationErrorUtil.hasErrors(errorList)) {
            throw new ResourceConflictException("Validation failed", errorList);
        }

        AssessmentResult result = AssessmentResult.builder()
                .assignment(assignment)
                .student(assignment.getStudents().get(0)) // Just picking the first student for simplicity or mapping logic needed
                .round(round)
                .score(request.getScore())
                .comment(request.getComments())
                .evaluationId(user)
                .evaluationDate(LocalDateTime.now().toLocalDate())
                .build();

        result = assessmentResultRepository.save(result);

        if (result.getStudent() != null && result.getStudent().getUser() != null) {
            NotificationEventDTO notification = NotificationEventDTO.builder()
                    .recipientId(result.getStudent().getUser().getUserId())
                    .title("🔔 Có điểm đánh giá định kỳ mới!")
                    .message("Báo cáo định kỳ của bạn đã được đánh giá và nhận xét.")
                    .type("EVALUATION_UPDATED")
                    .build();
            rabbitTemplate.convertAndSend(exchangeName, routingKey, notification);
        }

        return new ApiResponse<>(
                AssessmentResultMapper.toDTO(result),
                true,
                "Assessment result created successfully",
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
                assessmentResultPage = assessmentResultRepository.findAllByAssignmentIdAndMentorId(assignmentId, search, user.getUserId(), pageable);
            } else {
                assessmentResultPage = assessmentResultRepository.searchByMentorId(user.getMentor().getMentorId(), search, pageable);
            }

        } else if (user.getRole() == Role.ROLE_STUDENT) {
            if (assignmentId != null) {
                if (!internshipAssignmentRepository.existsByStudentIdAndAssignmentId(user.getStudent().getStudentId(), assignmentId)) {
                    throw new ResourceForbiddenException("Student does not have permission to view assessment results for this assignment");
                }
                assessmentResultPage = assessmentResultRepository.findAllByAssignment_AssignmentIdAndStudent_StudentId(assignmentId, user.getStudent().getStudentId(), search, pageable);
            } else {
                assessmentResultPage = assessmentResultRepository.findAllByStudent_StudentId(user.getStudent().getStudentId(), search, pageable);
            }
        } else if (user.getRole() == Role.ROLE_TEACHER) {
            if (assignmentId != null) {
                assessmentResultPage = assessmentResultRepository.findAllByAssignment_AssignmentIdAndTeacherId(assignmentId, user.getUserId(), search, pageable);
            } else {
                assessmentResultPage = assessmentResultRepository.searchByTeacherId(user.getUserId(), search, pageable);
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

        if (!assessmentResultRepository.existsByResultIdAndMentorId(id, user.getMentor().getMentorId())) {
            throw new ResourceForbiddenException("You do not have permission to update this assessment result");
        }

        if (request.getScore() != null && (request.getScore().compareTo(BigDecimal.ZERO) < 0 || request.getScore().compareTo(new BigDecimal("10")) > 0)) {
            throw new ResourceConflictException("Score must be between 0 and 10", errorList);
        }
        if (ValidationErrorUtil.hasErrors(errorList)) {
            throw new ResourceConflictException("Validation failed", errorList);
        }

        AssessmentResultMapper.updateFromDto(assessmentResult, request);
        assessmentResultRepository.save(assessmentResult);

        if (assessmentResult.getStudent() != null && assessmentResult.getStudent().getUser() != null) {
            NotificationEventDTO notification = NotificationEventDTO.builder()
                    .recipientId(assessmentResult.getStudent().getUser().getUserId())
                    .title("🔔 Điểm đánh giá định kỳ đã cập nhật!")
                    .message("Điểm hoặc nhận xét báo cáo định kỳ của bạn đã được thay đổi.")
                    .type("EVALUATION_UPDATED")
                    .build();
            rabbitTemplate.convertAndSend(exchangeName, routingKey, notification);
        }

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
    public void saveBulkGrades(BulkAssessmentSaveRequest request) throws ResourceNotFoundException, ResourceConflictException, ResourceForbiddenException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        User currentUser = currentUserUtil.getCurrentUser();

        InternshipAssignment assignment = internshipAssignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phân công ID: " + request.getAssignmentId()));

        if (!internshipAssignmentRepository.existsByMentor_MentorIdAndAssignmentId(currentUser.getMentor().getMentorId(), request.getAssignmentId())) {
            throw new ResourceForbiddenException("Bạn không có quyền chấm điểm cho đề tài này!");
        }

        AssessmentRound round = AssessmentRoundsRepository.findById(request.getRoundId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vòng đánh giá ID: " + request.getRoundId()));

        List<AssessmentResult> resultsToSave = new ArrayList<>();

        for (StudentEvaluationRequest eval : request.getEvaluations()) {
            User student = UserRepository.findById(eval.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sinh viên ID: " + eval.getStudentId()));

            AssessmentResult result = assessmentResultRepository
                    .findByAssignment_AssignmentIdAndStudent_StudentIdAndRound_RoundId(
                            assignment.getAssignmentId(), student.getStudent().getStudentId(), round.getRoundId()
                    ).orElse(new AssessmentResult());
            if (eval.getScore() != null && (eval.getScore().compareTo(BigDecimal.ZERO) < 0 || eval.getScore().compareTo(new BigDecimal("10")) > 0)) {
                throw new ResourceConflictException("Điểm số cho sinh viên ID: " + eval.getStudentId() + " phải nằm trong khoảng từ 0 đến 10", errorList);
            }

            result.setAssignment(assignment);
            result.setStudent(student.getStudent());
            result.setRound(round);
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

        List<AssessmentResult> savedResults = assessmentResultRepository.saveAll(resultsToSave);
        for (AssessmentResult res : savedResults) {
            if (res.getStudent() != null && res.getStudent().getUser() != null) {
                NotificationEventDTO notification = NotificationEventDTO.builder()
                        .recipientId(res.getStudent().getUser().getUserId())
                        .title("🔔 Có điểm đánh giá định kỳ mới!")
                        .message("Báo cáo định kỳ của bạn đã được đánh giá và nhận xét.")
                        .type("EVALUATION_UPDATED")
                        .build();
                rabbitTemplate.convertAndSend(exchangeName, routingKey, notification);
            }
        }
    }
}
