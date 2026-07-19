package pka.edu.repository;

import pka.edu.entity.AssessmentRound;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IAssessmentRoundsRepository extends JpaRepository<AssessmentRound, Long> {
    Optional<AssessmentRound> findByRoundIdAndIsDeletedFalse(Long roundId);

    @Query("select a from AssessmentRound a join RoundCriteria r on a.roundId = r.round.roundId " +
            "join EvaluationCriteria e on e.criterionId = r.criterion.criterionId " +
            "where a.isDeleted = false and " +
            "(lower(a.roundName) like lower(concat('%', :keyword, '%')) or " +
            "lower(a.description) like lower(concat('%', :keyword, '%')) or " +
            "lower(a.phase.phaseName) like lower(concat('%', :keyword, '%')))")
    Page<AssessmentRound> findAllByKeyword(@Param("keyword") String keyword,
                                           Pageable pageable);

    @Query("select a from AssessmentRound a where a.phase.phaseId = :phaseId")
    Page<AssessmentRound> findAllByPhase_PhaseId(@Param("phaseId") Long phaseId,
                                                 Pageable pageable);

    @Query("select a from AssessmentRound a join RoundCriteria r on a.roundId = r.round.roundId " +
            "join EvaluationCriteria e on e.criterionId = r.criterion.criterionId " +
            "where (lower(a.roundName) like lower(concat('%', :keyword, '%')) or " +
            "lower(a.description) like lower(concat('%', :keyword, '%')) or " +
            "lower(a.phase.phaseName) like lower(concat('%', :keyword, '%'))) or " +
            "a.phase.phaseId = :phaseId ")
    Page<AssessmentRound> findAllByKeywordAndPhaseId(@Param("keyword") String keyword,
                                                     @Param("phaseId") Long phaseId,
                                                     Pageable pageable);
}
