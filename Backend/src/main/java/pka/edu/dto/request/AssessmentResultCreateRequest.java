package pka.edu.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AssessmentResultCreateRequest {

    @NotNull(message = "Assignment ID is required")
    private Long assignmentId;

    @NotNull(message = "Round ID is required")
    private Long roundId;

    @Valid
    @NotNull(message = "Results cannot be null")
    private List<CriterionScoreRequest> results;
}
