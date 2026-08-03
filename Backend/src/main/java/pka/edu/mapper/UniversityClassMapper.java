package pka.edu.mapper;

import pka.edu.dto.response.UniversityClassResponse;
import pka.edu.entity.UniversityClass;

public class UniversityClassMapper {
    public static UniversityClassResponse toDto(UniversityClass entity) {
        if (entity == null) {
            return null;
        }
        return UniversityClassResponse.builder()
                .classId(entity.getClassId())
                .className(entity.getClassName())
                .academicYear(entity.getAcademicYear())
                .semester(entity.getSemester())
                .maxStudents(entity.getMaxStudents())
                .universityId(entity.getUniversity() != null ? entity.getUniversity().getUniversityId() : null)
                .universityName(entity.getUniversity() != null ? entity.getUniversity().getUniversityName() : null)
                .teacherId(entity.getTeacher() != null ? entity.getTeacher().getUserId() : null)
                .teacherName(entity.getTeacher() != null ? entity.getTeacher().getFullName() : null)
                .isActive(entity.isActive())
                .studentCount(entity.getStudents() != null ? entity.getStudents().size() : 0)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
