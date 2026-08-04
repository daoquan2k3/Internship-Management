package pka.edu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalUsers;
    private long totalAssignments;
    private long totalReports;
    private long websiteVisits;

    private List<ChartDataResponse> visitorData;
    private List<ChartDataResponse> sourceData;
    private List<ChartDataResponse> pieData;
}