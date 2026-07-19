package pka.edu.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportResponse {
    private Long reportId;
    private String title;
    private String originalFileName;
    private String fileUrl;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime uploadTime;

    private String studentName;
    private String studentCode;
    private Long studentId;
    private Double score;
    private String feedback;
    private String reportStatus;

    private String aiSummary;
    private String aiBlockers;
    private String aiSentiment;
    private String aiSuggestedFeedback;
}