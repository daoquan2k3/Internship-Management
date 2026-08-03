package pka.edu.entity;

import pka.edu.util.enums.JoinRequestStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "final_evaluation_forms")
public class FinalEvaluationForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private UniversityClass universityClass;

    @Column(nullable = false)
    private String scannedFormUrl;

    @Column(name = "summary_report_url")
    private String summaryReportUrl;

    @Column(nullable = false)
    private boolean isHardCopySubmitted = false;

    private Double companyScore;

    private String companyFeedback;

    private Double teacherScore;

    private String teacherFeedback;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JoinRequestStatus teacherStatus = JoinRequestStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JoinRequestStatus universityRepStatus = JoinRequestStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
