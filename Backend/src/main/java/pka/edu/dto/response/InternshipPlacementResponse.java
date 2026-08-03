package pka.edu.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class InternshipPlacementResponse {
    private Long placementId;
    private Long studentId;
    private String studentCode;
    private String studentName;
    private Long classId;
    private String className;
    private Long companyId;
    private String companyName;
    private String taxCode;
    private String position;
    private Long mentorId;
    private String mentorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
