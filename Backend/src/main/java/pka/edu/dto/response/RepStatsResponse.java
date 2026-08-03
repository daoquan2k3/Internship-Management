package pka.edu.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepStatsResponse {
    private long totalClasses;
    private long totalStudents;
    private long pendingJoinRequests;
    private long totalEvaluations;
    private long pendingEvaluations;
    private long approvedEvaluations;
    private double completionRate;
    private String universityName;
}
