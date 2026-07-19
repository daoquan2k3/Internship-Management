package pka.edu.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EvaluationCriteriaResponse {
    private Long id;
    private String criterionName;
    private String description;
    private BigDecimal maxScore;
    private Boolean isDeleted;
}
