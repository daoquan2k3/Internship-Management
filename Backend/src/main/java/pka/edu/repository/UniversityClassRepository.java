package pka.edu.repository;

import pka.edu.entity.UniversityClass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UniversityClassRepository extends JpaRepository<UniversityClass, Long> {
    @EntityGraph(attributePaths = { "university", "teacher", "students" })
    @Query("SELECT c FROM UniversityClass c WHERE c.university.universityId = :universityId")
    Page<UniversityClass> findByUniversity_UniversityId(@Param("universityId") Long universityId, Pageable pageable);

    @EntityGraph(attributePaths = { "university", "teacher", "students" })
    @Query("SELECT c FROM UniversityClass c WHERE c.teacher.userId = :teacherId")
    Page<UniversityClass> findByTeacher_UserId(@Param("teacherId") Long teacherId, Pageable pageable);

    @Query("SELECT c FROM UniversityClass c WHERE c.classId = :classId AND c.university.universityId = :universityId")
    Optional<UniversityClass> findByClassIdAndUniversity_UniversityId(@Param("classId") Long classId,
            @Param("universityId") Long universityId);

    @Query("SELECT COUNT(c) FROM UniversityClass c WHERE c.university.universityId = :universityId")
    long countByUniversity_UniversityId(@Param("universityId") Long universityId);

    @Query("SELECT COALESCE(SUM(SIZE(c.students)), 0) FROM UniversityClass c WHERE c.university.universityId = :universityId")
    long countStudentsByUniversityId(@Param("universityId") Long universityId);
}
