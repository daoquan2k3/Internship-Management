package pka.edu.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CriterionScoreRequest {

    @NotNull(message = "Criterion ID cannot be null")
    private Long criterionId;

    @NotNull(message = "Score cannot be null")
    @Positive(message = "Score must be a positive number")
    private BigDecimal score;
    private String comments;
}
