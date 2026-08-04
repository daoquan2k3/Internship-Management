package pka.edu.repository;

import pka.edu.entity.AssessmentResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AssessmentResultRepository extends JpaRepository<AssessmentResult, Long> {

    boolean existsByAssignment_AssignmentIdAndRound_RoundId(@Param("assignmentId") Long assignmentId,
                                                   @Param("roundId") Long roundId);

    @Query("select count(ar) > 0 from AssessmentResult ar where " +
            "ar.resultId = :resultId and ar.assignment.mentor.mentorId = :userId")
    boolean existsByResultIdAndMentorId(@Param("resultId") Long resultId,
                                                   @Param("userId") Long userId);

    @Query("select ar from AssessmentResult ar where " +
            "ar.assignment.mentor.mentorId = :userId")
    Page<AssessmentResult> findAllByMentorId(@Param("userId") Long userId,
                                                        Pageable pageable);

    @Query("select ar from AssessmentResult ar where " +
            "ar.assignment.assignmentId = :assignmentId and " +
            "(:keyword is null or :keyword = '' or lower(ar.assignment.assignmentTitle) like lower(concat('%', :keyword, '%')))")
    Page<AssessmentResult> findAllByAssignment_AssignmentId(@Param("assignmentId") Long assignmentId,
                                                            @Param("keyword") String keyword,
                                                            Pageable pageable);

    @Query("select ar from AssessmentResult ar where " +
            "ar.assignment.assignmentId = :assignmentId and ar.assignment.mentor.mentorId = :userId and " +
            "(:keyword is null or :keyword = '' or lower(ar.assignment.assignmentTitle) like lower(concat('%', :keyword, '%')))")
    Page<AssessmentResult> findAllByAssignmentIdAndMentorId(@Param("assignmentId") Long assignmentId,
                                                                                  @Param("keyword") String keyword,
                                                                                  @Param("userId") Long userId,
                                                                                  Pageable pageable);

    @Query("select ar from AssessmentResult ar " +
            "where ar.student.studentId = :studentId and " +
            "(:keyword is null or :keyword = '' or lower(ar.assignment.assignmentTitle) like lower(concat('%', :keyword, '%')))")
    Page<AssessmentResult> findAllByStudent_StudentId(@Param("studentId") Long studentId,
                                                                 @Param("keyword") String keyword,
                                                                 Pageable pageable);

    @Query("select ar from AssessmentResult ar " +
            "where ar.student.studentId = :studentId and ar.assignment.assignmentId = :assignmentId and " +
            "(:keyword is null or :keyword = '' or lower(ar.assignment.assignmentTitle) like lower(concat('%', :keyword, '%')))")
    Page<AssessmentResult> findAllByAssignment_AssignmentIdAndStudent_StudentId(@Param("assignmentId") Long assignmentId,
                                                                                @Param("studentId") Long studentId,
                                                                                @Param("keyword") String keyword,
                                                                                Pageable pageable);

    @Query("select ar from AssessmentResult ar where " +
            "(:keyword is null or :keyword = '' or lower(ar.assignment.assignmentTitle) like lower(concat('%', :keyword, '%')))")
    Page<AssessmentResult> searchAllAssessmentResults(@Param("keyword") String keyword,
                                                      Pageable pageable);


    @Query("select ar from AssessmentResult ar where " +
            "ar.assignment.mentor.mentorId = :mentorId and " +
            "(:keyword is null or :keyword = '' or lower(ar.assignment.assignmentTitle) like lower(concat('%', :keyword, '%')))")
    Page<AssessmentResult> searchByMentorId(@Param("mentorId") Long mentorId,
                                            @Param("keyword") String keyword,
                                            Pageable pageable);

    @Query("select ar from AssessmentResult ar where " +
            "(ar.round.universityClass.teacher.userId = :teacherId or " +
            " exists (select 1 from UniversityClass uc join uc.students s where s.studentId = ar.student.studentId and uc.teacher.userId = :teacherId)) and " +
            "(:keyword is null or :keyword = '' or lower(ar.student.studentCode) like lower(concat('%', :keyword, '%')) or lower(ar.student.user.fullName) like lower(concat('%', :keyword, '%')) or lower(ar.assignment.assignmentTitle) like lower(concat('%', :keyword, '%')))")
    Page<AssessmentResult> searchByTeacherId(@Param("teacherId") Long teacherId,
                                             @Param("keyword") String keyword,
                                             Pageable pageable);

    @Query("select ar from AssessmentResult ar where " +
            "ar.assignment.assignmentId = :assignmentId and " +
            "(ar.round.universityClass.teacher.userId = :teacherId or " +
            " exists (select 1 from UniversityClass uc join uc.students s where s.studentId = ar.student.studentId and uc.teacher.userId = :teacherId)) and " +
            "(:keyword is null or :keyword = '' or lower(ar.student.studentCode) like lower(concat('%', :keyword, '%')) or lower(ar.student.user.fullName) like lower(concat('%', :keyword, '%')) or lower(ar.assignment.assignmentTitle) like lower(concat('%', :keyword, '%')))")
    Page<AssessmentResult> findAllByAssignment_AssignmentIdAndTeacherId(@Param("assignmentId") Long assignmentId,
                                                                        @Param("teacherId") Long teacherId,
                                                                        @Param("keyword") String keyword,
                                                                        Pageable pageable);

    Optional<AssessmentResult> findByAssignment_AssignmentIdAndStudent_StudentIdAndRound_RoundId(
            Long assignmentId, Long studentId, Long roundId);
}
