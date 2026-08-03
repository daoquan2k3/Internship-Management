package pka.edu.mapper;

import pka.edu.dto.response.FinalEvaluationFormResponse;
import pka.edu.entity.FinalEvaluationForm;

public class FinalEvaluationFormMapper {
    public static FinalEvaluationFormResponse toDto(FinalEvaluationForm entity) {
        if (entity == null) {
            return null;
        }
        return FinalEvaluationFormResponse.builder()
                .id(entity.getId())
                .studentId(entity.getStudent().getStudentId())
                .studentCode(entity.getStudent().getStudentCode())
                .studentName(entity.getStudent().getUser().getFullName())
                .classId(entity.getUniversityClass().getClassId())
                .className(entity.getUniversityClass().getClassName())
                .scannedFormUrl(entity.getScannedFormUrl())
                .summaryReportUrl(entity.getSummaryReportUrl())
                .isHardCopySubmitted(entity.isHardCopySubmitted())
                .companyScore(entity.getCompanyScore())
                .companyFeedback(entity.getCompanyFeedback())
                .teacherScore(entity.getTeacherScore())
                .teacherFeedback(entity.getTeacherFeedback())
                .teacherStatus(entity.getTeacherStatus())
                .universityRepStatus(entity.getUniversityRepStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
