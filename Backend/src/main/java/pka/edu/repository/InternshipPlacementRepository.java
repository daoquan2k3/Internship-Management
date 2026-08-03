package pka.edu.repository;

import pka.edu.entity.InternshipPlacement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InternshipPlacementRepository extends JpaRepository<InternshipPlacement, Long> {
    Page<InternshipPlacement> findByUniversityClass_ClassId(Long classId, Pageable pageable);
    Page<InternshipPlacement> findByStudent_StudentId(Long studentId, Pageable pageable);
    Page<InternshipPlacement> findByCompany_CompanyId(Long companyId, Pageable pageable);
    Page<InternshipPlacement> findByMentor_MentorId(Long mentorId, Pageable pageable);
    Optional<InternshipPlacement> findByStudent_StudentIdAndUniversityClass_ClassId(Long studentId, Long classId);
}
