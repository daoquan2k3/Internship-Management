package pka.edu.repository;

import pka.edu.entity.InternshipApplication;
import pka.edu.util.enums.JoinRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InternshipApplicationRepository extends JpaRepository<InternshipApplication, Long> {
    @Query("SELECT i FROM InternshipApplication i WHERE i.universityClass.classId = :classId")
    Page<InternshipApplication> findByUniversityClass_ClassId(@Param("classId") Long classId, Pageable pageable);

    @Query("SELECT i FROM InternshipApplication i WHERE i.student.studentId = :studentId AND i.universityClass.classId = :classId")
    Optional<InternshipApplication> findByStudent_StudentIdAndUniversityClass_ClassId(
            @Param("studentId") Long studentId, @Param("classId") Long classId);

    @Query("SELECT i FROM InternshipApplication i WHERE i.universityClass.classId = :classId AND i.status = :status")
    Page<InternshipApplication> findByUniversityClass_ClassIdAndStatus(@Param("classId") Long classId,
            @Param("status") JoinRequestStatus status, Pageable pageable);

    @Query("SELECT i FROM InternshipApplication i WHERE i.student.studentId = :studentId")
    Page<InternshipApplication> findByStudent_StudentId(@Param("studentId") Long studentId, Pageable pageable);

    @Query("SELECT COUNT(i) FROM InternshipApplication i WHERE i.student.studentId = :studentId")
    long countByStudent_StudentId(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(i) FROM InternshipApplication i WHERE i.student.studentId = :studentId AND i.status IN :statuses")
    long countByStudent_StudentIdAndStatusIn(@Param("studentId") Long studentId, @Param("statuses") java.util.Collection<JoinRequestStatus> statuses);

    @Query("SELECT i FROM InternshipApplication i WHERE i.company.companyId = :companyId")
    Page<InternshipApplication> findByCompany_CompanyId(@Param("companyId") Long companyId, Pageable pageable);
}
