package pka.edu.repository;

import pka.edu.entity.InternshipPlacement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

@Repository
public interface InternshipPlacementRepository extends JpaRepository<InternshipPlacement, Long> {
    @Query("SELECT p FROM InternshipPlacement p WHERE p.universityClass.classId = :classId")
    Page<InternshipPlacement> findByUniversityClass_ClassId(@Param("classId") Long classId, Pageable pageable);

    @Query("SELECT p FROM InternshipPlacement p WHERE p.student.studentId = :studentId")
    Page<InternshipPlacement> findByStudent_StudentId(@Param("studentId") Long studentId, Pageable pageable);

    @Query("SELECT p FROM InternshipPlacement p WHERE p.company.companyId = :companyId")
    Page<InternshipPlacement> findByCompany_CompanyId(@Param("companyId") Long companyId, Pageable pageable);

    @Query("SELECT p FROM InternshipPlacement p WHERE p.mentor.mentorId = :mentorId")
    Page<InternshipPlacement> findByMentor_MentorId(@Param("mentorId") Long mentorId, Pageable pageable);
    
    @Query("SELECT p FROM InternshipPlacement p WHERE p.student.studentId = :studentId")
    List<InternshipPlacement> findAllByStudent_StudentId(@Param("studentId") Long studentId);

    @Query("SELECT p FROM InternshipPlacement p WHERE p.student.studentId = :studentId AND p.universityClass.classId = :classId")
    Optional<InternshipPlacement> findByStudent_StudentIdAndUniversityClass_ClassId(@Param("studentId") Long studentId, @Param("classId") Long classId);
}
