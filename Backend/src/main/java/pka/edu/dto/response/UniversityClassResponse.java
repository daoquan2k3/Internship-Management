package pka.edu.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UniversityClassResponse {
    private Long classId;
    private String className;
    private String academicYear;
    private String semester;
    private Integer maxStudents;
    private Long universityId;
    private String universityName;
    private Long teacherId;
    private String teacherName;
    private boolean isActive;
    private int studentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
