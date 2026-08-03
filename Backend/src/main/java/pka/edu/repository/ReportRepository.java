package pka.edu.repository;

import pka.edu.entity.Report;
import pka.edu.util.enums.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    @Query("select r from Report r where (:keyword is null or :keyword = '' or lower(r.title) like lower(concat('%', :keyword, '%')))")
    Page<Report> findAllByAdmin(@Param("keyword") String keyword,
                                Pageable pageable);

    @Query("select r from Report r where " +
            "(:classId is null or :classId = 0L or r.universityClass.classId = :classId or r.assessmentRound.universityClass.classId = :classId) and " +
            "(:keyword is null or :keyword = '' or lower(r.title) like lower(concat('%', :keyword, '%')) or lower(r.user.student.studentCode) like lower(concat('%', :keyword, '%')) or lower(r.user.fullName) like lower(concat('%', :keyword, '%')))")
    Page<Report> findAllByAdminAndClassId(@Param("classId") Long classId,
                                          @Param("keyword") String keyword,
                                          Pageable pageable);

    @Query("select r from Report r where " +
            "(:classId is null or :classId = 0L or r.universityClass.classId = :classId or r.assessmentRound.universityClass.classId = :classId) and " +
            "(r.universityClass.university.universityId = :universityId or r.assessmentRound.universityClass.university.universityId = :universityId) and " +
            "(:keyword is null or :keyword = '' or lower(r.title) like lower(concat('%', :keyword, '%')) or lower(r.user.student.studentCode) like lower(concat('%', :keyword, '%')) or lower(r.user.fullName) like lower(concat('%', :keyword, '%')))")
    Page<Report> findByUniversityId(@Param("universityId") Long universityId,
                                    @Param("classId") Long classId,
                                    @Param("keyword") String keyword,
                                    Pageable pageable);

    @Query("select r from Report r where r.user.student.studentId in " +
            "(select s.studentId from InternshipAssignment ia join ia.students s where ia.mentor.mentorId = :mentorId) and " +
            "(:keyword is null or :keyword = '' or lower(r.title) like lower(concat('%', :keyword, '%')))")
    Page<Report> findByMentorId(@Param("mentorId") Long mentorId,
                                @Param("keyword") String keyword,
                                Pageable pageable);

    @Query("select r from Report r where " +
            "(:classId is null or :classId = 0L or r.universityClass.classId = :classId or r.assessmentRound.universityClass.classId = :classId) and " +
            "(r.universityClass.teacher.userId = :teacherId or r.assessmentRound.universityClass.teacher.userId = :teacherId) and " +
            "(:keyword is null or :keyword = '' or lower(r.title) like lower(concat('%', :keyword, '%')) or lower(r.user.student.studentCode) like lower(concat('%', :keyword, '%')) or lower(r.user.fullName) like lower(concat('%', :keyword, '%')))")
    Page<Report> findByTeacherId(@Param("teacherId") Long teacherId,
                                 @Param("classId") Long classId,
                                 @Param("keyword") String keyword,
                                 Pageable pageable);


    @Query("select r from Report r where r.user.student.studentId = :studentId and " +
            "(:keyword is null or :keyword = '' or lower(r.title) like lower(concat('%', :keyword, '%')))" +
            "order by r.uploadTime desc")
    Page<Report> findByStudentId(@Param("studentId") Long studentId,
                                 @Param("keyword") String keyword,
                                 Pageable pageable);

    @Query("SELECT COUNT(r) FROM Report r " +
            "WHERE r.reportStatus = :status " +
            "AND r.user.student IN (" +
            "  SELECT s FROM InternshipAssignment ia " +
            "  JOIN ia.students s " +
            "  WHERE ia.mentor.mentorId = :mentorId" +
            ")")
    long countReportsByMentorIdAndStatus(@Param("mentorId") Long mentorId,
                                         @Param("status") ReportStatus status);

    @Query("SELECT COUNT(DISTINCT s.studentId) " +
            "FROM Report r " +
            "JOIN r.user u " +
            "JOIN u.student s " +
            "JOIN InternshipAssignment ia ON s MEMBER OF ia.students " +
            "WHERE ia.mentor.mentorId = :mentorId " +
            "AND r.reportStatus = :status")
    long countDistinctStudentsGradedByMentor(@Param("mentorId") Long mentorId,
                                             @Param("status") ReportStatus status);

    @Query("SELECT COUNT(r) FROM Report r WHERE r.user.student.studentId = :studentId")
    long countReportsByStudentId(@Param("studentId") Long studentId);

    // Tính điểm trung bình của các báo cáo đã chấm
    @Query("SELECT COALESCE(AVG(r.score), 0.0) FROM Report r WHERE r.user.student.studentId = :studentId AND r.reportStatus = 'GRADED'")
    double getAverageScoreByStudentId(@Param("studentId") Long studentId);
}
