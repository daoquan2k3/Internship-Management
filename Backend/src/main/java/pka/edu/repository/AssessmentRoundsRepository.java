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
public interface AssessmentRoundsRepository extends JpaRepository<AssessmentRound, Long> {
    Optional<AssessmentRound> findByRoundIdAndIsDeletedFalse(Long roundId);

    @Query("select a from AssessmentRound a " +
            "where a.isDeleted = false and " +
            "(lower(a.roundName) like lower(concat('%', :keyword, '%')) or " +
            "lower(a.description) like lower(concat('%', :keyword, '%')))")
    Page<AssessmentRound> findAllByKeyword(@Param("keyword") String keyword,
                                           Pageable pageable);

    @Query("select a from AssessmentRound a where a.universityClass.classId = :classId")
    Page<AssessmentRound> findAllByUniversityClass_ClassId(@Param("classId") Long classId, Pageable pageable);

    @Query("select distinct a from AssessmentRound a " +
            "where a.universityClass.teacher.userId = :teacherId and a.isDeleted = false and " +
            "(lower(a.roundName) like lower(concat('%', :keyword, '%')) or " +
            "lower(a.description) like lower(concat('%', :keyword, '%')))")
    Page<AssessmentRound> findAllByKeywordAndTeacherId(@Param("keyword") String keyword, @Param("teacherId") Long teacherId, Pageable pageable);

    @Query("select a from AssessmentRound a where a.universityClass.teacher.userId = :teacherId and a.isDeleted = false")
    Page<AssessmentRound> findAllByTeacherId(@Param("teacherId") Long teacherId, Pageable pageable);

    @Query("select a from AssessmentRound a where a.universityClass.university.universityId = :universityId and a.isDeleted = false")
    Page<AssessmentRound> findAllByUniversityId(@Param("universityId") Long universityId, Pageable pageable);

    @Query("select distinct a from AssessmentRound a " +
            "where a.universityClass.university.universityId = :universityId and a.isDeleted = false and " +
            "(lower(a.roundName) like lower(concat('%', :keyword, '%')) or " +
            "lower(a.description) like lower(concat('%', :keyword, '%')))")
    Page<AssessmentRound> findAllByKeywordAndUniversityId(@Param("keyword") String keyword, @Param("universityId") Long universityId, Pageable pageable);
}
