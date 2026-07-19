package pka.edu.controller;

import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.DashboardStatsResponse;
import pka.edu.dto.response.MentorStatsResponse;
import pka.edu.dto.response.StudentStatsResponse;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/dashboards")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats() {
        DashboardStatsResponse stats = dashboardService.getDashboardStats();

        ApiResponse<DashboardStatsResponse> response = new ApiResponse<>(
                stats, true, "Lấy thống kê hệ thống thành công", null, LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/mentor-stats")
    @PreAuthorize("hasAuthority('ROLE_MENTOR')")
    public ResponseEntity<ApiResponse<MentorStatsResponse>> getMentorStats(Principal principal) throws ResourceNotFoundException {
        MentorStatsResponse stats = dashboardService.getMentorStats(principal.getName());

        return ResponseEntity.ok(new ApiResponse<>(
                stats, true, "Lấy thống kê Mentor thành công", null, LocalDateTime.now()
        ));
    }

    @GetMapping("/student-stats")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<StudentStatsResponse>> getStudentStats(Principal principal) throws ResourceNotFoundException {
        StudentStatsResponse stats = dashboardService.getStudentStats(principal.getName());

        return ResponseEntity.ok(new ApiResponse<>(
                stats, true, "Lấy thống kê Student thành công", null, LocalDateTime.now()
        ));
    }
}