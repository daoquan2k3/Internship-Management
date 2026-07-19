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
public class RoundCriterionCreateRequest {
    @NotNull(message = "Criterion ID is required.")
    private Long criterionId;

    @NotNull(message = "Weight is required.")
    @Positive(message = "Weight must be a positive number.")
    private BigDecimal weight;

    private Long roundId;
}
