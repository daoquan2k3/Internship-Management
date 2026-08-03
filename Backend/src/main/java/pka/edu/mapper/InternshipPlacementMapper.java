package pka.edu.mapper;

import pka.edu.dto.response.InternshipPlacementResponse;
import pka.edu.entity.InternshipPlacement;

public class InternshipPlacementMapper {
    public static InternshipPlacementResponse toDto(InternshipPlacement entity) {
        if (entity == null) {
            return null;
        }
        return InternshipPlacementResponse.builder()
                .placementId(entity.getPlacementId())
                .studentId(entity.getStudent().getStudentId())
                .studentCode(entity.getStudent().getStudentCode())
                .studentName(entity.getStudent().getUser().getFullName())
                .classId(entity.getUniversityClass().getClassId())
                .className(entity.getUniversityClass().getClassName())
                .companyId(entity.getCompany() != null ? entity.getCompany().getCompanyId() : null)
                .companyName(entity.getCompany() != null ? entity.getCompany().getCompanyName() : entity.getCompanyName())
                .taxCode(entity.getTaxCode())
                .position(entity.getPosition())
                .mentorId(entity.getMentor() != null ? entity.getMentor().getMentorId() : null)
                .mentorName(entity.getMentor() != null ? entity.getMentor().getUser().getFullName() : null)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
