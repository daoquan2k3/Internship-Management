package pka.edu.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateCompanyInfoRequest {
    @NotBlank(message = "Company name is required")
    private String companyName;

    private String taxCode;
    private String contactPhone;

    @NotBlank(message = "Position is required")
    private String position;
}
