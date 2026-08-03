package pka.edu.dto.response;

import pka.edu.util.enums.JoinRequestStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UniversityJoinRequestResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentCode;
    private String major;
    private String classRoom;
    private Long universityId;
    private String universityName;
    private String universityStudentId;
    private JoinRequestStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
