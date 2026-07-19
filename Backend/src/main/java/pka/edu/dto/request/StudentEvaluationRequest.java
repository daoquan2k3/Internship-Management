package pka.edu.dto.request;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentEvaluationRequest {
    private Long studentId;
    private BigDecimal score;
    private String contribution;
    private String comment; 
}