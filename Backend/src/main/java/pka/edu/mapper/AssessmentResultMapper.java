package pka.edu.mapper;

import pka.edu.dto.request.AssessmentResultUpdateRequest;
import pka.edu.dto.response.AssessmentResultResponse;
import pka.edu.entity.AssessmentResult;

public class AssessmentResultMapper {
    public static AssessmentResultResponse toDTO(AssessmentResult entity) {
        return AssessmentResultResponse.builder()
                .id(entity.getResultId())
                .assignmentId(entity.getAssignment().getAssignmentId())
                .assignmentName(entity.getAssignment().getAssignmentTitle())

                // Map thông tin sinh viên
                .studentId(entity.getStudent().getStudentId())
                .studentName(entity.getStudent().getUser().getFullName())
                .studentCode(entity.getStudent().getStudentCode())
                .studentAvatarUrl(entity.getStudent().getUser().getAvatarUrl())

                .roundId(entity.getRound().getRoundId())
                .roundName(entity.getRound().getRoundName())

                .score(entity.getScore())
                .contribution(entity.getContribution())
                .comments(entity.getComment()) // Nhớ lấy đúng trường comment trong entity
                .evaluatorId(entity.getEvaluationId().getUserId())
                .evaluatorName(entity.getEvaluationId().getFullName())
                .evaluatorAvatarUrl(entity.getEvaluationId().getAvatarUrl())
                .evaluationDate(entity.getEvaluationDate())
                .build();
    }

    public static void updateFromDto(AssessmentResult entity, AssessmentResultUpdateRequest dto) {
        if (dto.getScore() != null) {
            entity.setScore(dto.getScore());
        }
        if (dto.getComments() != null) {
            entity.setComment(dto.getComments());
        }
    }
}
