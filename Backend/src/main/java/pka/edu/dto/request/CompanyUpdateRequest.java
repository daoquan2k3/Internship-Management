package pka.edu.dto.request;

import jakarta.validation.constraints.Email;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyUpdateRequest {
    private String companyName;
    private String address;

    @Email(message = "Invalid email format")
    private String email;

    private String phoneNumber;
    private String websiteUrl;
    private Boolean isActive;
    private Boolean isVerified;
}
