package pka.edu.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import pka.edu.validation.ValidDateRange;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ValidDateRange(startDateField = "startDate", endDateField = "endDate")
public class AssessmentRoundCreateRequest {

    @NotNull(message = "Phase ID is required.")
    private Long phaseId;

    private Long classId;

    @NotBlank(message = "Round name is required.")
    private String roundName;

    @NotNull(message = "Start date is required.")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @NotNull(message = "End date is required.")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    private String description;

}
