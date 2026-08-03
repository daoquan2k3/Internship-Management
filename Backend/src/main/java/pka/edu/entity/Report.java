package pka.edu.entity;

import pka.edu.util.enums.ReportStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    private String title;

    private String originalFileName;

    private LocalDateTime uploadTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "round_id")
    private AssessmentRound assessmentRound;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private UniversityClass universityClass;

    private String fileUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ReportStatus reportStatus = ReportStatus.PENDING;

    private Double score;

    private String feedback;

    @Column(columnDefinition = "TEXT")
    private String aiSummary;

    @Column(columnDefinition = "TEXT")
    private String aiBlockers;

    private String aiSentiment;

    @Column(columnDefinition = "TEXT")
    private String aiSuggestedFeedback;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
