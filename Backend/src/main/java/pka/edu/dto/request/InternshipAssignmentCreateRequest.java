package pka.edu.dto.request;

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
public class InternshipAssignmentCreateRequest {
    @NotBlank(message = "Assignment title is required.")
    private String assignmentTitle;

    private String assignmentDescription;
    @NotNull(message = "Phase ID is required.")
    private Long phaseId;

    @NotNull(message = "Student ID is required.")
    private List<Long> studentIds;

    @NotNull(message = "Mentor ID is required.")
    private Long mentorId;

    private LocalDate dueDate;
}
