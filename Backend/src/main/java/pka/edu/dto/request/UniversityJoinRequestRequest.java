package pka.edu.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UniversityJoinRequestRequest {
    @NotNull(message = "University ID is required")
    private Long universityId;
    
    @jakarta.validation.constraints.NotBlank(message = "University student ID is required")
    private String universityStudentId;

    private String notes;
}
