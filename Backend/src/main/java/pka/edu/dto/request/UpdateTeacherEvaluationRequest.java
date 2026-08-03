package pka.edu.dto.request;

import pka.edu.util.enums.JoinRequestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateTeacherEvaluationRequest {
    @NotNull(message = "Status is required")
    private JoinRequestStatus status;
    
    private Double teacherScore;
    
    private String teacherFeedback;
}
