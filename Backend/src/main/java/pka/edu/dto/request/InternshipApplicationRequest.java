package pka.edu.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InternshipApplicationRequest {
    @NotNull(message = "Class ID is required")
    private Long classId;
    
    private String softCopyUrl;

    private String companyName;

    private String taxCode;
    private String contactPhone;

    private String position;
    private Long companyId;
}
