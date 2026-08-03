package pka.edu.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import pka.edu.util.enums.JoinRequestStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FinalEvaluationFormResponse {
    private Long id;
    private Long studentId;
    private String studentCode;
    private String studentName;
    private Long classId;
    private String className;
    private String scannedFormUrl;
    private String summaryReportUrl;
    @JsonProperty("isHardCopySubmitted")
    private boolean isHardCopySubmitted;
    private Double companyScore;
    private String companyFeedback;
    private Double teacherScore;
    private String teacherFeedback;
    private JoinRequestStatus teacherStatus;
    private JoinRequestStatus universityRepStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
