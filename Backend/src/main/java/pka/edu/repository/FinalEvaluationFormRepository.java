package pka.edu.repository;

import pka.edu.entity.FinalEvaluationForm;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FinalEvaluationFormRepository extends JpaRepository<FinalEvaluationForm, Long> {
    @Query("SELECT f FROM FinalEvaluationForm f WHERE f.universityClass.classId = :classId")
    Page<FinalEvaluationForm> findByUniversityClass_ClassId(@Param("classId") Long classId, Pageable pageable);

    @Query("SELECT f FROM FinalEvaluationForm f WHERE f.student.studentId = :studentId")
    Page<FinalEvaluationForm> findByStudent_StudentId(@Param("studentId") Long studentId, Pageable pageable);

    @Query("SELECT f FROM FinalEvaluationForm f WHERE f.student.studentId = :studentId AND f.universityClass.classId = :classId")
    Optional<FinalEvaluationForm> findByStudent_StudentIdAndUniversityClass_ClassId(@Param("studentId") Long studentId,
            @Param("classId") Long classId);

    @Query("SELECT f FROM FinalEvaluationForm f WHERE f.universityClass.university.universityId = :universityId")
    Page<FinalEvaluationForm> findByUniversityClass_University_UniversityId(@Param("universityId") Long universityId,
            Pageable pageable);

    @Query("SELECT f FROM FinalEvaluationForm f WHERE f.universityClass.teacher.userId = :teacherId AND (:classId is null OR :classId = 0L OR f.universityClass.classId = :classId)")
    Page<FinalEvaluationForm> findByTeacherId(@Param("teacherId") Long teacherId, @Param("classId") Long classId,
            Pageable pageable);

    @Query("SELECT COUNT(f) FROM FinalEvaluationForm f WHERE f.universityClass.university.universityId = :universityId")
    long countByUniversityId(@Param("universityId") Long universityId);

    @Query("SELECT COUNT(f) FROM FinalEvaluationForm f WHERE f.universityClass.university.universityId = :universityId AND f.universityRepStatus = :status")
    long countByUniversityIdAndRepStatus(@Param("universityId") Long universityId, @Param("status") pka.edu.util.enums.JoinRequestStatus status);
}
