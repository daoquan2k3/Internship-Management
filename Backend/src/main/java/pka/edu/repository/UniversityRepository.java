package pka.edu.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pka.edu.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long> {
    @Query("SELECT u FROM University u WHERE u.universityCode = :code")
    Optional<University> findByUniversityCode(@Param("code") String code);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN TRUE ELSE FALSE END FROM University u WHERE u.universityCode = :code")
    boolean existsByUniversityCode(@Param("code") String code);

    @Query("SELECT u FROM University u WHERE u.universityId = :id AND u.isDeleted = false")
    Optional<University> findByUniversityIdAndIsDeletedFalse(@Param("id") Long id);

    @Query("SELECT u FROM University u WHERE LOWER(u.universityName) LIKE LOWER(CONCAT('%', :name, '%')) AND u.isDeleted = false")
    Page<University> findByUniversityNameContainingIgnoreCaseAndIsDeletedFalse(@Param("name") String name, Pageable pageable);

    @Query("SELECT u FROM University u WHERE u.isDeleted = false")
    Page<University> findAllByIsDeletedFalse(Pageable pageable);
}
