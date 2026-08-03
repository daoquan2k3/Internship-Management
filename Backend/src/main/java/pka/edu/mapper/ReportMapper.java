package pka.edu.mapper;

import pka.edu.dto.response.ReportResponse;
import pka.edu.entity.Report;

public class ReportMapper {
    public static ReportResponse toDTO(Report report) {
        if (report == null) return null;

        return ReportResponse.builder()
                .reportId(report.getReportId())
                .title(report.getTitle())
                .originalFileName(report.getOriginalFileName())
                .fileUrl(report.getFileUrl())
                .uploadTime(report.getUploadTime())
                .studentId(report.getUser().getStudent().getStudentId())
                .studentCode(report.getUser().getStudent().getStudentCode())
                .studentName(report.getUser().getFullName())
                .score(report.getScore())
                .feedback(report.getFeedback())
                .reportStatus(report.getReportStatus().name())
                .aiSummary(report.getAiSummary())
                .aiBlockers(report.getAiBlockers())
                .aiSentiment(report.getAiSentiment())
                .aiSuggestedFeedback(report.getAiSuggestedFeedback())
                .roundId(report.getAssessmentRound() != null ? report.getAssessmentRound().getRoundId() : null)
                .roundName(report.getAssessmentRound() != null ? report.getAssessmentRound().getRoundName() : null)
                .build();
    }
}