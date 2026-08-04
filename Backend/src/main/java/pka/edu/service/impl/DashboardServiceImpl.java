package pka.edu.service.impl;

import pka.edu.dto.response.ChartDataResponse;
import pka.edu.dto.response.DashboardStatsResponse;
import pka.edu.dto.response.MentorStatsResponse;
import pka.edu.dto.response.RepStatsResponse;
import pka.edu.dto.response.StudentStatsResponse;
import pka.edu.entity.SiteTraffic;
import pka.edu.entity.User;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.repository.*;
import pka.edu.service.IDashboardService;
import pka.edu.util.enums.JoinRequestStatus;
import pka.edu.util.enums.Role;
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
public class DashboardServiceImpl implements IDashboardService {

        private final UserRepository userRepository;
        private final InternshipAssignmentRepository assignmentRepository;
        private final ReportRepository reportRepository;
        private final SiteTrafficRepository siteTrafficRepository;
        private final UniversityClassRepository classRepository;
        private final UniversityJoinRequestRepository joinRequestRepository;
        private final FinalEvaluationFormRepository finalEvaluationFormRepository;
        private final pka.edu.repository.UniversityRepository universityRepository;

        @Override
        public DashboardStatsResponse getDashboardStats() {
                long totalUsers = userRepository.count();
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
                long totalStudents = userRepository.countByRole(Role.ROLE_STUDENT);
                long pendingReports = totalStudents > totalReports ? totalStudents - totalReports : 0;
                pieData.add(new ChartDataResponse("Đã nộp", totalReports));
                pieData.add(new ChartDataResponse("Chưa nộp", pendingReports));

                return DashboardStatsResponse.builder()
                                .totalUsers(totalUsers)
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

                long totalTeachers = userRepository.countByRole(Role.ROLE_TEACHER);
                long totalUniReps = userRepository.countByRole(Role.ROLE_UNIVERSITY_REP);
                long totalCompanyReps = userRepository.countByRole(Role.ROLE_COMPANY_REP);
                long totalCompanyMentors = userRepository.countByRole(Role.ROLE_COMPANY_MENTOR);
                long totalUniversities = universityRepository.count();
                long totalClasses = classRepository.count();

                return MentorStatsResponse.builder()
                                .totalGroups(totalTeachers)
                                .totalStudents(totalUniReps)
                                .pendingReports(totalCompanyReps)
                                .completionRate(totalCompanyMentors)
                                .totalTeachers(totalTeachers)
                                .totalUniReps(totalUniReps)
                                .totalUniversities(totalUniversities)
                                .totalClasses(totalClasses)
                                .totalCompanyReps(totalCompanyReps)
                                .totalCompanyMentors(totalCompanyMentors)
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

                double progress = 0.0;
                org.springframework.data.domain.Page<pka.edu.entity.FinalEvaluationForm> formsPage = finalEvaluationFormRepository
                                .findByStudent_StudentId(studentId,
                                                org.springframework.data.domain.PageRequest.of(0, 1));
                if (!formsPage.isEmpty()) {
                        pka.edu.entity.FinalEvaluationForm form = formsPage.getContent().get(0);
                        if (form.getUniversityRepStatus() == JoinRequestStatus.APPROVED
                                        || form.getTeacherStatus() == JoinRequestStatus.APPROVED) {
                                progress = 100.0;
                        } else {
                                progress = 90.0; // Đã nộp phiếu đánh giá cuối kỳ, chờ duyệt
                        }
                } else if (totalAssignments > 0) {
                        progress = Math.round(((double) completedAssignments / totalAssignments) * 80.0);
                } else if (submittedReports > 0) {
                        progress = Math.min(80.0, submittedReports * 20.0);
                }

                LocalDate today = LocalDate.now();
                LocalDate nextWeek = today.plusDays(7);
                long upcomingDeadlines = assignmentRepository.countUpcomingDeadlinesByStudentId(studentId, today,
                                nextWeek);

                return StudentStatsResponse.builder()
                                .progress(progress)
                                .submittedReports(submittedReports)
                                .averageScore(averageScore)
                                .upcomingDeadlines(upcomingDeadlines)
                                .build();
        }

        @Override
        public RepStatsResponse getRepStats(String username) throws ResourceNotFoundException {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));
                if (user.getUniversity() == null) {
                        throw new ResourceNotFoundException("Tài khoản chưa được liên kết với trường đại học nào");
                }
                Long universityId = user.getUniversity().getUniversityId();
                String uniName = user.getUniversity().getUniversityName();

                long totalClasses = classRepository.countByUniversity_UniversityId(universityId);
                long totalStudents = classRepository.countStudentsByUniversityId(universityId);
                long pendingJoinRequests = joinRequestRepository.countByUniversity_UniversityIdAndStatus(universityId,
                                JoinRequestStatus.PENDING);

                long totalEvaluations = finalEvaluationFormRepository.countByUniversityId(universityId);
                long pendingEvaluations = finalEvaluationFormRepository.countByUniversityIdAndRepStatus(universityId,
                                JoinRequestStatus.PENDING);
                long approvedEvaluations = finalEvaluationFormRepository.countByUniversityIdAndRepStatus(universityId,
                                JoinRequestStatus.APPROVED);

                double completionRate = totalEvaluations > 0
                                ? Math.round(((double) approvedEvaluations / totalEvaluations) * 100.0)
                                : 0.0;

                return RepStatsResponse.builder()
                                .totalClasses(totalClasses)
                                .totalStudents(totalStudents)
                                .pendingJoinRequests(pendingJoinRequests)
                                .totalEvaluations(totalEvaluations)
                                .pendingEvaluations(pendingEvaluations)
                                .approvedEvaluations(approvedEvaluations)
                                .completionRate(completionRate)
                                .universityName(uniName)
                                .build();
        }
}
