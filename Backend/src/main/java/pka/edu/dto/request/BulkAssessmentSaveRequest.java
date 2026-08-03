package pka.edu.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BulkAssessmentSaveRequest {
    @NotNull(message = "Assignment ID không được trống")
    private Long assignmentId;

    @NotNull(message = "Round ID không được trống")
    private Long roundId;



    @NotNull(message = "Danh sách điểm không được trống")
    private List<StudentEvaluationRequest> evaluations;
}