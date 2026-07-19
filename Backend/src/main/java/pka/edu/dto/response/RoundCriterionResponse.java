package pka.edu.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoundCriterionResponse {
    private Long criterionId;
    private String roundName;
    private String criterionName;
    private BigDecimal weight;
    private BigDecimal maxScore;
    private boolean isDeleted;
}
