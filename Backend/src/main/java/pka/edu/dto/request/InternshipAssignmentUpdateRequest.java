package pka.edu.dto.request;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InternshipAssignmentUpdateRequest {

    private String status;

    private String assignmentTitle;
    private String assignmentDescription;
    private Long mentorId;
    private Long phaseId;
    private List<Long> studentIds;
    private LocalDate dueDate;
}
