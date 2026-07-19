package pka.edu.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import pka.edu.validation.ValidDateRange;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ValidDateRange(startDateField = "startDate", endDateField = "endDate")
public class InternshipPhaseUpdateRequest {

    private String phaseName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;


    private String description;

    private Boolean isDeleted;
}
