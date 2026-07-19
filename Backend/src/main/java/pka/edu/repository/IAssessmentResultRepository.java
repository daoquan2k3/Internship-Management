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
public interface IAssessmentResultRepository extends JpaRepository<AssessmentResult, Long> {

    @Query("select count(ar) > 0 from AssessmentResult ar where " +
            "ar.assignment.assignmentId = :assignmentId " +
            "and ar.round.roundId = :roundId " +
            "and ar.criterion.criterionId = :criterionId")
    boolean existsByAssignmentAndRoundAndCriterion(@Param("assignmentId") Long assignmentId,
                                                   @Param("roundId") Long roundId,
                                                   @Param("criterionId") Long criterionId);

    @Query("select count(ar) > 0 from AssessmentResult ar where " +
            "ar.resultId = :resultId and ar.assignment.mentor.mentorId = :userId")
    boolean existsByResultIdAndEvaluationId_UserId(@Param("resultId") Long resultId,
                                                   @Param("userId") Long userId);

    @Query("select ar from AssessmentResult ar where " +
            "ar.assignment.mentor.mentorId = :userId")
    Page<AssessmentResult> findAllByEvaluationId_UserId(@Param("userId") Long userId,
                                                        Pageable pageable);

    @Query("select ar from AssessmentResult ar where " +
            "ar.assignment.assignmentId = :assignmentId and " +
            "(:keyword is null or :keyword = '' or lower(ar.assignment.phase.phaseName) like lower(concat('%', :keyword, '%')))")
    Page<AssessmentResult> findAllByAssignment_AssignmentId(@Param("assignmentId") Long assignmentId,
                                                            @Param("keyword") String keyword,
                                                            Pageable pageable);

    @Query("select ar from AssessmentResult ar where " +
            "ar.assignment.assignmentId = :assignmentId and ar.assignment.mentor.mentorId = :userId and " +
            "(:keyword is null or :keyword = '' or lower(ar.assignment.phase.phaseName) like lower(concat('%', :keyword, '%')))")
    Page<AssessmentResult> findAllByAssignment_AssignmentIdAndEvaluationId_UserId(@Param("assignmentId") Long assignmentId,
                                                                                  @Param("keyword") String keyword,
                                                                                  @Param("userId") Long userId,
                                                                                  Pageable pageable);

    @Query("select distinct ar from AssessmentResult ar " +
            "join ar.assignment ia " +
            "join ia.students s " +
            "where s.studentId = :studentId and " +
            "(:keyword is null or :keyword = '' or lower(ar.assignment.phase.phaseName) like lower(concat('%', :keyword, '%')))")
    Page<AssessmentResult> findAllByAssignment_Student_StudentId(@Param("studentId") Long studentId,
                                                                 @Param("keyword") String keyword,
                                                                 Pageable pageable);

    @Query("select ar from AssessmentResult ar where " +
            "(:keyword is null or :keyword = '' or lower(ar.assignment.phase.phaseName) like lower(concat('%', :keyword, '%')))")
    Page<AssessmentResult> searchAllAssessmentResults(@Param("keyword") String keyword,
                                                      Pageable pageable);


    @Query("select ar from AssessmentResult ar where " +
            "ar.assignment.mentor.mentorId = :mentorId and " +
            "(:keyword is null or :keyword = '' or lower(ar.assignment.phase.phaseName) like lower(concat('%', :keyword, '%')))")
    Page<AssessmentResult> searchByMentorId(@Param("mentorId") Long mentorId,
                                            @Param("keyword") String keyword,
                                            Pageable pageable);
    Optional<AssessmentResult> findByAssignment_AssignmentIdAndStudent_StudentIdAndRound_RoundIdAndCriterion_CriterionId(
            Long assignmentId, Long studentId, Long roundId, Long criterionId);
}
