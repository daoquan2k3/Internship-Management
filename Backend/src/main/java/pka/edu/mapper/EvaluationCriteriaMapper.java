package pka.edu.mapper;

import pka.edu.dto.request.EvaluationCriteriaCreateRequest;
import pka.edu.dto.request.EvaluationCriteriaUpdateRequest;
import pka.edu.dto.response.EvaluationCriteriaResponse;
import pka.edu.entity.EvaluationCriteria;

public class EvaluationCriteriaMapper {
    public static EvaluationCriteriaResponse toDTO(EvaluationCriteria entity) {
        return EvaluationCriteriaResponse.builder().id(entity.getCriterionId()).criterionName(entity.getCriterionName())
                .description(entity.getDescription())
                .maxScore(entity.getMaxScore())
                .isDeleted(entity.isDeleted())
                .build();
    }

    public static EvaluationCriteria toEntity(EvaluationCriteriaCreateRequest dto) {
        return EvaluationCriteria.builder()
                .criterionName(dto.getCriterionName())
                .description(dto.getDescription())
                .maxScore(dto.getMaxScore())
                .build();
    }

    public static void updateFromDto(EvaluationCriteria entity, EvaluationCriteriaUpdateRequest dto) {
        if (dto.getCriterionName() != null) {
            entity.setCriterionName(dto.getCriterionName());
        }
        if (dto.getDescription() != null) {
            entity.setDescription(dto.getDescription());
        }
        if (dto.getMaxScore() != null) {
            entity.setMaxScore(dto.getMaxScore());
        }
        if (dto.getIsDeleted() != null) {
            entity.setDeleted(dto.getIsDeleted());
        }
    }
}
