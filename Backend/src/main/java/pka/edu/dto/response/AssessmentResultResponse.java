package pka.edu.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AssessmentResultResponse {
    private Long id;
    private Long assignmentId;
    private String assignmentName;

    private Long roundId;
    private String roundName;


    private BigDecimal score;
    private String comments;
    private Long evaluatorId;
    private String evaluatorName;
    private String evaluatorAvatarUrl;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate evaluationDate;

    private Long studentId;
    private String studentName;
    private String studentCode;
    private String studentAvatarUrl;
    private String contribution;
}
