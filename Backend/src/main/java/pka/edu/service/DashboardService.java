package pka.edu.service;

import pka.edu.dto.response.DashboardStatsResponse;
import pka.edu.dto.response.MentorStatsResponse;
import pka.edu.dto.response.StudentStatsResponse;
import pka.edu.exception.ResourceNotFoundException;

public interface DashboardService {

    DashboardStatsResponse getDashboardStats();
    MentorStatsResponse getMentorStats(String username) throws ResourceNotFoundException;
    StudentStatsResponse getStudentStats(String username) throws ResourceNotFoundException;
}
