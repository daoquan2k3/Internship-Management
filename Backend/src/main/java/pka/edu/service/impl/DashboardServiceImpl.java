package pka.edu.service.impl;

import pka.edu.dto.response.ChartDataResponse;
import pka.edu.dto.response.DashboardStatsResponse;
import pka.edu.dto.response.MentorStatsResponse;
import pka.edu.dto.response.StudentStatsResponse;
import pka.edu.entity.SiteTraffic;
import pka.edu.entity.User;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.repository.*;
import pka.edu.service.DashboardService;
import pka.edu.util.enums.ReportStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final IUserRepository userRepository;
    private final InternshipPhaseRepository phaseRepository;
    private final InternshipAssignmentRepository assignmentRepository;
    private final IReportRepository reportRepository;
    private final SiteTrafficRepository siteTrafficRepository;

    @Override
    public DashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long activePhases = phaseRepository.count();
        long totalAssignments = assignmentRepository.count();
        long totalReports = reportRepository.count();

        List<SiteTraffic> traffics = siteTrafficRepository.findAll();
        long totalVisits = traffics.stream().mapToLong(SiteTraffic::getVisitCount).sum();

        List<ChartDataResponse> visitorData = traffics.stream()
                .sorted(Comparator.comparing(SiteTraffic::getVisitDate).reversed())
                .limit(6)
                .map(t -> new ChartDataResponse(t.getVisitDate().toString(), t.getVisitCount()))
                .collect(Collectors.toList());
        Collections.reverse(visitorData);

        List<ChartDataResponse> pieData = new ArrayList<>();
        long totalStudents = userRepository.count();
        long pendingReports = totalStudents > totalReports ? totalStudents - totalReports : 0;
        pieData.add(new ChartDataResponse("Đã nộp", totalReports));
        pieData.add(new ChartDataResponse("Chưa nộp", pendingReports));

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .activePhases(activePhases)
                .totalAssignments(totalAssignments)
                .totalReports(totalReports)
                .websiteVisits(totalVisits)
                .pieData(pieData)
                .visitorData(visitorData)
                .build();
    }

    @Override
    public MentorStatsResponse getMentorStats(String username) throws ResourceNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));
        Long mentorId = user.getMentor().getMentorId();

        long totalGroups = assignmentRepository.countByMentor_MentorId(mentorId);

        long totalStudents = userRepository.countStudentsByMentorId(mentorId);

        long pendingReports = reportRepository.countReportsByMentorIdAndStatus(mentorId, ReportStatus.PENDING);
        long studentsGraded = reportRepository.countDistinctStudentsGradedByMentor(mentorId, ReportStatus.GRADED);

        double completionRate = totalStudents > 0
                ? Math.round(((double) studentsGraded / totalStudents) * 100.0)
                : 0.0;

        return MentorStatsResponse.builder()
                .totalGroups(totalGroups)
                .totalStudents(totalStudents)
                .pendingReports(pendingReports)
                .completionRate(completionRate)
                .build();
    }

    @Override
    public StudentStatsResponse getStudentStats(String username) throws ResourceNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));
        Long studentId = user.getStudent().getStudentId();

        long submittedReports = reportRepository.countReportsByStudentId(studentId);
        double averageScore = reportRepository.getAverageScoreByStudentId(studentId);
        averageScore = Math.round(averageScore * 10.0) / 10.0;

        long totalAssignments = assignmentRepository.countTotalAssignmentsByStudentId(studentId);
        long completedAssignments = assignmentRepository.countCompletedAssignmentsByStudentId(studentId);

        double progress = totalAssignments > 0
                ? Math.round(((double) completedAssignments / totalAssignments) * 100.0)
                : 0.0;

        LocalDate today = LocalDate.now();
        LocalDate nextWeek = today.plusDays(7);
        long upcomingDeadlines = assignmentRepository.countUpcomingDeadlinesByStudentId(studentId, today, nextWeek);

        return StudentStatsResponse.builder()
                .progress(progress)
                .submittedReports(submittedReports)
                .averageScore(averageScore)
                .upcomingDeadlines(upcomingDeadlines)
                .build();
    }
}