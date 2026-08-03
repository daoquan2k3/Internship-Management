package pka.edu.dto.request;

import lombok.Data;

@Data
public class UpdateInternshipApplicationRequest {
    private Boolean isHardCopySubmitted;
    private Boolean isCreditConditionMet;
}
