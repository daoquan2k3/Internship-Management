package pka.edu.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UniversityResponse {
    private Long universityId;
    private String name;
    private String address;
    private String contactEmail;
}
