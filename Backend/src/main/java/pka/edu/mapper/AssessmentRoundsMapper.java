package pka.edu.mapper;

import pka.edu.dto.request.AssessmentRoundCreateRequest;
import pka.edu.dto.request.AssessmentRoundUpdateRequest;
import pka.edu.dto.request.RoundCriterionUpdateRequest;
import pka.edu.dto.response.AssessmentRoundsResponse;
import pka.edu.entity.AssessmentRound;
import pka.edu.entity.InternshipPhase;
import pka.edu.entity.RoundCriteria;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.util.ValidationErrorUtil;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class AssessmentRoundsMapper {
    public static AssessmentRoundsResponse toDto(AssessmentRound assessmentRounds) {
        return AssessmentRoundsResponse.builder()
                .id(assessmentRounds.getRoundId())
                .roundName(assessmentRounds.getRoundName())
                .startDate(assessmentRounds.getStartDate())
                .endDate(assessmentRounds.getEndDate())
                .phaseName(assessmentRounds.getPhase().getPhaseName())
                .description(assessmentRounds.getDescription())
                .roundCriteria(assessmentRounds.getRoundCriteriaList().stream()
                        .map(RoundCriteriaMapper::toDto)
                        .toList())
                .isDeleted(assessmentRounds.isDeleted())
                .phaseId(assessmentRounds.getPhase().getPhaseId())
                .build();
    }

    public static AssessmentRound toEntity(AssessmentRoundCreateRequest request, InternshipPhase phase) {
        return AssessmentRound.builder()
                .phase(phase)
                .roundName(request.getRoundName())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .build();
    }

    public static void updateFromDto(AssessmentRound assessmentRound, AssessmentRoundUpdateRequest request) throws ResourceConflictException, ResourceBadRequestException, ResourceNotFoundException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        if (request.getRoundName() != null) {
            assessmentRound.setRoundName(request.getRoundName());
        }
        if (request.getStartDate() != null) {
            if (request.getStartDate().isAfter(assessmentRound.getEndDate())) {
                errorList.put("startDate", "Start date cannot be after end date");
                throw new ResourceBadRequestException("Validation failed", errorList);
            }
            assessmentRound.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            if (request.getEndDate().isBefore(assessmentRound.getStartDate())) {
                errorList.put("endDate", "End date cannot be before start date");
                throw new ResourceBadRequestException("Validation failed", errorList);
            }
            assessmentRound.setEndDate(request.getEndDate());
        }
        if (request.getDescription() != null) {
            assessmentRound.setDescription(request.getDescription());
        }
        if (request.getIsActive() != null) {
            assessmentRound.setIsActive(request.getIsActive());
        }
        if (request.getRoundCriteria() != null) {
            Set<Long> uniqueCriterionIds = new HashSet<>();
            for (RoundCriterionUpdateRequest req : request.getRoundCriteria()) {
                if (!uniqueCriterionIds.add(req.getCriterionId())) {
                    ValidationErrorUtil.addError(errorList, "roundCriteria", "Duplicate criterion ID");
                    throw new ResourceConflictException("Validation failed", errorList);
                }
                RoundCriteria roundCriteria = assessmentRound.getRoundCriteriaList()
                        .stream()
                        .filter(rc -> rc
                                .getCriterion()
                                .getCriterionId().equals(req.getCriterionId()))
                        .findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("Round criteria not found with id: " + req.getCriterionId()));
                roundCriteria.setWeight(req.getWeight());
            }
        }
        if (request.getIsDeleted() != null) {
            assessmentRound.setDeleted(request.getIsDeleted());
        }
    }

}
