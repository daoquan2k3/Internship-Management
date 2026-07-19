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
    Optional<InternshipPhase> findByPhaseIdAndIsDeletedFalse(Long phaseId);

    boolean existsByPhaseNameIgnoreCaseAndIsDeletedFalse(String phaseName);

    boolean existsByPhaseNameIgnoreCaseAndIsDeletedFalseAndPhaseIdNot(String phaseName, Long phaseId);

    @Query("select i from InternshipPhase i where " +
            "lower(i.phaseName) like lower(concat('%', :keyword, '%'))")
    Page<InternshipPhase> findAllByKeyword(Pageable pageable, @Param("keyword") String keyword);


}
