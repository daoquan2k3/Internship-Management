package pka.edu.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import pka.edu.util.enums.JoinRequestStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InternshipApplicationResponse {
    private Long applicationId;
    private Long studentId;
    private String studentName;
    private Long classId;
    private String className;
    private String softCopyUrl;
    @JsonProperty("isHardCopySubmitted")
    private boolean isHardCopySubmitted;
    @JsonProperty("isCreditConditionMet")
    private boolean isCreditConditionMet;
    private JoinRequestStatus status;
    private String companyName;
    private String taxCode;
    private String contactPhone;
    private String position;
    private Long companyId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
