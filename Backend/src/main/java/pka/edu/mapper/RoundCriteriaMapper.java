package pka.edu.mapper;

import pka.edu.dto.request.RoundCriterionCreateRequest;
import pka.edu.dto.request.RoundCriterionUpdateRequest;
import pka.edu.dto.response.RoundCriterionResponse;
import pka.edu.entity.AssessmentRound;
import pka.edu.entity.EvaluationCriteria;
import pka.edu.entity.RoundCriteria;

public class RoundCriteriaMapper {
    public static RoundCriterionResponse toDto(RoundCriteria rc) {
        return RoundCriterionResponse.builder()
                .criterionName(rc.getCriterion().getCriterionName())
                .weight(rc.getWeight())
                .maxScore(rc.getCriterion().getMaxScore())
                .roundName(rc.getRound().getRoundName())
                .isDeleted(rc.isDeleted())
                .criterionId(rc.getCriterion().getCriterionId())
                .build();
    }

    public static RoundCriteria toEntity(RoundCriterionCreateRequest request, AssessmentRound assessmentRound, EvaluationCriteria evaluationCriteria) {
        return RoundCriteria.builder()
                .round(assessmentRound)
                .criterion(evaluationCriteria)
                .weight(request.getWeight())
                .build();
    }

    public static void updateFromDto(RoundCriteria rc, RoundCriterionUpdateRequest request) {
        if (request.getWeight() != null) {
            rc.setWeight(request.getWeight());
        }
    }
}
