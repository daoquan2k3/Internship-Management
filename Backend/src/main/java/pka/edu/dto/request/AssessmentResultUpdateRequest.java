package pka.edu.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AssessmentResultUpdateRequest {
    @Positive(message = "Score must be a positive number.")
    private BigDecimal score;
    private String comments;
}
