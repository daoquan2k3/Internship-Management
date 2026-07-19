package pka.edu.mapper;

import pka.edu.dto.request.InternshipPhaseCreateRequest;
import pka.edu.dto.request.InternshipPhaseUpdateRequest;
import pka.edu.dto.response.InternshipPhaseResponse;
import pka.edu.entity.InternshipPhase;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.util.ValidationErrorUtil;

import java.util.Map;

public class InternshipPhaseMapper {
    public static InternshipPhaseResponse toDto(InternshipPhase internshipPhase) {
        return InternshipPhaseResponse.builder()
                .id(internshipPhase.getPhaseId())
                .phaseName(internshipPhase.getPhaseName())
                .startDate(internshipPhase.getStartDate())
                .endDate(internshipPhase.getEndDate())
                .description(internshipPhase.getDescription())
                .isDeleted(internshipPhase.isDeleted())
                .build();
    }

    public static InternshipPhase toEntity(InternshipPhaseCreateRequest request) {
        return InternshipPhase.builder()
                .phaseName(request.getPhaseName())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .build();
    }

    public static void updateFromDto(InternshipPhase internshipPhase, InternshipPhaseUpdateRequest request)
            throws ResourceBadRequestException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        if (request.getPhaseName() != null) {
            internshipPhase.setPhaseName(request.getPhaseName());
        }
        if (request.getStartDate() != null) {
            if (request.getStartDate().isAfter(internshipPhase.getEndDate())) {
                errorList.put("startDate", "Start date cannot be after end date");
                throw new ResourceBadRequestException("Validation failed", errorList);
            }
            internshipPhase.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            if (request.getEndDate().isBefore(internshipPhase.getStartDate())) {
                errorList.put("endDate", "End date cannot be before start date");
                throw new ResourceBadRequestException("Validation failed", errorList);
            }
            internshipPhase.setEndDate(request.getEndDate());
        }
        if (request.getDescription() != null) {
            internshipPhase.setDescription(request.getDescription());
        }
        if (request.getIsDeleted() != null) {
            internshipPhase.setDeleted(request.getIsDeleted());
        }
    }
}
