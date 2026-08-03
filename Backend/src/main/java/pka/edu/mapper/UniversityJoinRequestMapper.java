package pka.edu.mapper;

import pka.edu.dto.response.UniversityJoinRequestResponse;
import pka.edu.entity.Student;
import pka.edu.entity.UniversityJoinRequest;

public class UniversityJoinRequestMapper {
    public static UniversityJoinRequestResponse toDto(UniversityJoinRequest entity) {
        if (entity == null) {
            return null;
        }
        Student studentProfile = entity.getUser() != null ? entity.getUser().getStudent() : null;
        return UniversityJoinRequestResponse.builder()
                .id(entity.getId())
                .studentId(entity.getUser() != null ? entity.getUser().getUserId() : null)
                .studentName(entity.getUser() != null ? entity.getUser().getFullName() : null)
                .studentCode(studentProfile != null ? studentProfile.getStudentCode() : entity.getUniversityStudentId())
                .major(studentProfile != null ? studentProfile.getMajor() : null)
                .classRoom(studentProfile != null ? studentProfile.getClassRoom() : null)
                .universityId(entity.getUniversity() != null ? entity.getUniversity().getUniversityId() : null)
                .universityName(entity.getUniversity() != null ? entity.getUniversity().getUniversityName() : null)
                .universityStudentId(entity.getUniversityStudentId())
                .status(entity.getStatus())
                .notes(entity.getNotes())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
