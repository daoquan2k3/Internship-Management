package pka.edu.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyCreateRequest {
    @NotBlank(message = "Company code is required")
    private String companyCode;

    @NotBlank(message = "Company name is required")
    private String companyName;

    private String address;

    @Email(message = "Invalid email format")
    private String email;

    private String phoneNumber;
    
    private String websiteUrl;
}
