package pka.edu.repository;

import pka.edu.entity.EvaluationCriteria;
import pka.edu.entity.RoundCriteria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IRoundCriteriaRepository extends JpaRepository<RoundCriteria, Long> {


    @Query("select count(rc) > 0 from RoundCriteria rc where " +
            "rc.criterion.criterionId = :criterionId and rc.round.roundId = :roundId " +
            " and rc.isDeleted = false and " +
            "rc.criterion.isDeleted = false and rc.round.isDeleted = false ")
    boolean existsByCriterionAndRound(@Param("roundId") Long roundId,  @Param("criterionId") Long criterionId);


    Optional<RoundCriteria> findByRoundCriteriaId(Long roundCriteriaId);

    @Query("select rc from RoundCriteria rc where rc.round.roundId = :roundId")
    Page<RoundCriteria> findAllByRound_RoundId(@Param("roundId") Long roundId, Pageable pageable);


    @Query("select rc.criterion from RoundCriteria rc where " +
            "rc.criterion.criterionId = :criterionId and " +
            "rc.round.roundId = :roundId and rc.isDeleted = false")
    Optional<EvaluationCriteria> findByCriterionId(@Param("criterionId") Long criterionId, @Param("roundId") Long roundId);
}
