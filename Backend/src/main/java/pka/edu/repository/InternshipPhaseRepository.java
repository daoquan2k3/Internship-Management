package pka.edu.repository;

import pka.edu.entity.InternshipPhase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InternshipPhaseRepository extends JpaRepository<InternshipPhase, Long> {
    @Query("SELECT i FROM InternshipPhase i WHERE i.phaseId = :phaseId AND i.isDeleted = false")
    Optional<InternshipPhase> findByPhaseIdAndIsDeletedFalse(@Param("phaseId") Long phaseId);

    @Query("SELECT CASE WHEN COUNT(i) > 0 THEN TRUE ELSE FALSE END FROM InternshipPhase i WHERE LOWER(i.phaseName) = LOWER(:phaseName) AND i.isDeleted = false")
    boolean existsByPhaseNameIgnoreCaseAndIsDeletedFalse(@Param("phaseName") String phaseName);

    @Query("SELECT CASE WHEN COUNT(i) > 0 THEN TRUE ELSE FALSE END FROM InternshipPhase i WHERE LOWER(i.phaseName) = LOWER(:phaseName) AND i.isDeleted = false AND i.phaseId <> :phaseId")
    boolean existsByPhaseNameIgnoreCaseAndIsDeletedFalseAndPhaseIdNot(@Param("phaseName") String phaseName, @Param("phaseId") Long phaseId);

    @Query("select i from InternshipPhase i where " +
            "lower(i.phaseName) like lower(concat('%', :keyword, '%'))")
    Page<InternshipPhase> findAllByKeyword(Pageable pageable, @Param("keyword") String keyword);


}
