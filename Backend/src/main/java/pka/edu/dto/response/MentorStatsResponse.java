package pka.edu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorStatsResponse {
    private long totalGroups;
    private long totalStudents;
    private long pendingReports;
    private double completionRate;
}