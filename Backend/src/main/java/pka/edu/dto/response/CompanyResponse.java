package pka.edu.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyResponse {
    private Long companyId;
    private String companyCode;
    private String companyName;
    private String address;
    private String email;
    private String phoneNumber;
    private String logoUrl;
    private String websiteUrl;
    private boolean isActive;
    private boolean isVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
