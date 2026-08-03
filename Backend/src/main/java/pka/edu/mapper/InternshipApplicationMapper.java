package pka.edu.mapper;

import pka.edu.dto.response.InternshipApplicationResponse;
import pka.edu.entity.InternshipApplication;

public class InternshipApplicationMapper {
    public static InternshipApplicationResponse toDto(InternshipApplication entity) {
        if (entity == null) {
            return null;
        }
        return InternshipApplicationResponse.builder()
                .applicationId(entity.getApplicationId())
                .studentId(entity.getStudent().getStudentId())
                .studentName(entity.getStudent().getUser().getFullName())
                .classId(entity.getUniversityClass().getClassId())
                .className(entity.getUniversityClass().getClassName())
                .softCopyUrl(entity.getSoftCopyUrl())
                .companyName(entity.getCompanyName())
                .taxCode(entity.getTaxCode())
                .contactPhone(entity.getContactPhone())
                .position(entity.getPosition())
                .companyId(entity.getCompany() != null ? entity.getCompany().getCompanyId() : null)
                .isHardCopySubmitted(entity.isHardCopySubmitted())
                .isCreditConditionMet(entity.isCreditConditionMet())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
