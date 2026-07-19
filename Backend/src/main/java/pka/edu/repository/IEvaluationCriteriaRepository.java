package pka.edu.repository;

import pka.edu.entity.EvaluationCriteria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IEvaluationCriteriaRepository extends JpaRepository<EvaluationCriteria, Long> {
    Optional<EvaluationCriteria> findByCriterionIdAndIsDeletedFalse(Long criterionId);

    @Query("select count(c) > 0 from EvaluationCriteria c where c.isDeleted = false and " +
            "lower(replace(trim(c.criterionName), ' ',' ')) = lower(:criterionName) ")
    boolean existsByCriterionNameIgnoreCaseAndIsDeletedFalse(@Param("criterionName") String criterionName);

    boolean existsByCriterionNameIgnoreCaseAndIsDeletedFalseAndCriterionIdNot(String criterionName, Long criterionId);

    @Query("select c from EvaluationCriteria c where " +
           "(lower(c.criterionName) like lower(concat('%', :keyword, '%')) or " +
           "lower(c.description) like lower(concat('%', :keyword, '%')))")
    Page<EvaluationCriteria> findAllByKeyword(Pageable pageable, @Param("keyword") String keyword);
}
