package pka.edu.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FinalEvaluationFormRequest {
    @NotNull(message = "Class ID is required")
    private Long classId;
    
    @NotBlank(message = "Scanned form URL is required")
    private String scannedFormUrl;
    
    private String summaryReportUrl;
    
    private Double companyScore;
    private String companyFeedback;
    private Double teacherScore;
    private String teacherFeedback;
    private Boolean isHardCopySubmitted;
}
