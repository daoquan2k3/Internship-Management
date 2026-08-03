package pka.edu.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UniversityRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private String address;
    private String contactEmail;
}
