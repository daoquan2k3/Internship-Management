package pka.edu.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import pka.edu.validation.ValidDateRange;
import jakarta.validation.Valid;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ValidDateRange(startDateField = "startDate", endDateField = "endDate")
public class AssessmentRoundUpdateRequest {

    private String roundName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    private String description;
    private Boolean isActive;

    @Valid
    private List<RoundCriterionUpdateRequest> roundCriteria;
    private Boolean isDeleted;
}
