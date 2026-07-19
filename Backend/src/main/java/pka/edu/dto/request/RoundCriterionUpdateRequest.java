package pka.edu.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoundCriterionUpdateRequest {
    private Long roundId;
    private Long criterionId;

    @Positive(message = "Weight must be a positive number.")
    private BigDecimal weight;
}
