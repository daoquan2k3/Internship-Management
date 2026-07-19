package pka.edu.util;

import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.PageResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.function.Function;


public class PaginationUtil {

    public static Pageable createPageRequest(PageRequestDTO pageRequestDTO, String entityType) {

        // Danh sách các trường được phép sort cho User
        List<String> userAllowedSortFields = List.of("userId", "username", "email", "fullName", "role", "createdAt", "updatedAt");
        // Danh sách các trường được phép sort cho Student
        List<String> studentAllowedSortFields = List.of("studentId", "studentCode", "major", "classRoom", "dateOfBirth", "address", "createdAt", "updatedAt");
        // Danh sách các trường được phép sort cho Mentor
        List<String> mentorAllowedSortFields = List.of("mentorId", "department", "academicRank", "createdAt", "updatedAt");
        // Danh sách các trường được phép sort cho InternshipPhase
        List<String> internshipPhaseAllowedSortFields = List.of("phaseId", "phaseName", "description", "createdAt", "updatedAt");

        // Danh sach các trường được phép sort cho EvaluationCriteria
        List<String> evaluationAllowedSortFields = List.of("criterionId", "criterionName", "maxScore", "description", "createdAt", "updatedAt");

        // Danh sách các trường được sort cho AssessmentRound
        List<String> assessmentRoundAllowedSortFields = List.of("roundId", "phase", "roundName", "startDate", "endDate", "description", "createdAt", "updatedAt");

        // Danh sách các trường được sort cho RoundCriteria
        List<String> roundCriteriaAllowedSortFields = List.of("roundCriteriaId", "round", "criterion", "weight", "createdAt", "updatedAt");

        // Danh sách các trường được sort cho InternshipAssignment
        List<String> internshipAssignmentAllowedSortFields = List.of("assignmentId", "student", "mentor", "phase", "assignedDate",  "status", "createdAt", "updatedAt");

        // Danh sách các trường được sort cho AssessmentResult
        List<String> assessmentResultAllowedSortFields = List.of("resultId", "assignment", "round", "criterion", "score","comment", "evaluationDate", "evaluationId", "createdAt", "updatedAt");

        List<String> reportAllowedSortFields = List.of("reportId", "title", "originalFileName", "storedFileName", "uploadTime", "createdAt", "updatedAt");

        List<String> notificationAllowedSortFields = List.of("id", "title", "message", "createdAt");

        int page = pageRequestDTO.getPage() != null && pageRequestDTO.getPage() > 0 ? pageRequestDTO.getPage() : 0;
        int size = pageRequestDTO.getSize() != null && pageRequestDTO.getSize() > 0 ? pageRequestDTO.getSize() : 10;

        List<String> allAllowedFields = switch (entityType){
            case "user" -> userAllowedSortFields;
            case "student" -> studentAllowedSortFields;
            case "mentor" -> mentorAllowedSortFields;
            case "internshipPhase" -> internshipPhaseAllowedSortFields;
            case "evaluationCriteria" -> evaluationAllowedSortFields;
            case "assessmentRound" -> assessmentRoundAllowedSortFields;
            case "roundCriteria" -> roundCriteriaAllowedSortFields;
            case "internshipAssignment" -> internshipAssignmentAllowedSortFields;
            case "assessmentResult" -> assessmentResultAllowedSortFields;
            case "report" -> reportAllowedSortFields;
            case "notification" -> notificationAllowedSortFields;
            default -> List.of("createdAt");
        };

        String sortBy = pageRequestDTO.getSortBy() != null && allAllowedFields.contains(pageRequestDTO.getSortBy())
                ? pageRequestDTO.getSortBy()
                : "createdAt";

        Sort.Direction direction;
        try {
            direction = pageRequestDTO.getSortDirection() == null || pageRequestDTO.getSortDirection().isBlank()
                    ? Sort.Direction.ASC
                    : Sort.Direction.fromString(pageRequestDTO.getSortDirection());
        } catch (Exception e) {
            direction = Sort.Direction.ASC; // Tránh user sort ko theo asc hoặc desc
        }

        return PageRequest.of(page, size, Sort.by(direction, sortBy));
    }

    public static <T, R> PageResponseDTO<R> toPageResponseDTO(Page<T> page, Function<T, R> mapper) {
        List<R> content = page.getContent().stream()
                .map(mapper)
                .toList();
        return new PageResponseDTO<>(
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                content,
                page.hasNext(),
                page.hasPrevious()
        );
    }
}
