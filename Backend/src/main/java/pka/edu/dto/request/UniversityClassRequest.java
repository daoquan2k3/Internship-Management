package pka.edu.dto.request;

import lombok.Data;

@Data
public class UniversityClassRequest {
    private String className;
    private String academicYear;
    private String semester;
    private Integer maxStudents;
    private Long teacherId;
    private Long universityId; // optional, dùng khi admin tạo lớp
}
