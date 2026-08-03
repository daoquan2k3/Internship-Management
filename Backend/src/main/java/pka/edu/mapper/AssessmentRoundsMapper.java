package pka.edu.mapper;

import pka.edu.dto.request.AssessmentRoundCreateRequest;
import pka.edu.dto.request.AssessmentRoundUpdateRequest;
import pka.edu.dto.response.AssessmentRoundsResponse;
import pka.edu.entity.AssessmentRound;
import pka.edu.entity.InternshipPhase;

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

                .isDeleted(assessmentRounds.isDeleted())
                .phaseId(assessmentRounds.getPhase().getPhaseId())
                .build();
    }

    public static AssessmentRound toEntity(AssessmentRoundCreateRequest request, InternshipPhase phase, pka.edu.entity.UniversityClass universityClass) {
        return AssessmentRound.builder()
                .phase(phase)
                .universityClass(universityClass)
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

        if (request.getIsDeleted() != null) {
            assessmentRound.setDeleted(request.getIsDeleted());
        }
    }

}
