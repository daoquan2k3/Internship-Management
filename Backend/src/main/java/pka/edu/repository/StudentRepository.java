package pka.edu.repository;

import pka.edu.entity.Student;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN TRUE ELSE FALSE END FROM Student s WHERE s.studentCode = :studentCode")
    boolean existsByStudentCode(@Param("studentCode") String studentCode);

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN TRUE ELSE FALSE END FROM Student s WHERE s.studentCode = :studentCode AND s.studentId <> :studentId")
    boolean existsByStudentCodeAndStudentIdNot(@Param("studentCode") String studentCode, @Param("studentId") Long studentId);

    @Query("select s from Student s where s.studentId = :studentId and s.user.isDeleted = false and s.user.isActive = true")
    Optional<Student> findByStudentId(@Param("studentId") Long studentId);

    @Query("select s from Student s where s.user.userId = :userId and s.user.isDeleted = false and s.user.isActive = true")
    Optional<Student> findByUser_UserId(@Param("userId") Long userId);

    @Query("select s from Student s where s.user.isDeleted = false and s.user.isActive = true")
    Page<Student> findAllStudents(Pageable pageable);

    @Query("select s from Student s left join s.user u where u.isDeleted = false and u.isActive = true " +
           "and (:search is null or :search = '' or " +
           "lower(u.fullName) like lower(concat('%', :search, '%')) or " +
           "lower(u.email) like lower(concat('%', :search, '%')) or " +
           "lower(s.studentCode) like lower(concat('%', :search, '%')) or " +
           "cast(s.studentId as string) like concat('%', :search, '%'))")
    Page<Student> findAllStudentsWithSearch(@Param("search") String search, Pageable pageable);

    @Query("select s from Student s where s.studentId in :studentIds and s.user.isDeleted = false and s.user.isActive = true")
    List<Student> findAllByStudentId(@Param("studentIds") List<Long> studentIds);

    @Query("select distinct s from Student s left join s.user u " +
           "where exists (select 1 from UniversityClass uc join uc.students ucs where uc.teacher.userId = :teacherId and ucs = s) " +
           "and (:search is null or :search = '' or " +
           "lower(u.fullName) like lower(concat('%', :search, '%')) or " +
           "lower(u.email) like lower(concat('%', :search, '%')) or " +
           "lower(s.studentCode) like lower(concat('%', :search, '%')) or " +
           "cast(s.studentId as string) like concat('%', :search, '%'))")
    Page<Student> findStudentsByTeacherIdWithSearch(@Param("teacherId") Long teacherId, @Param("search") String search, Pageable pageable);

    @Query("select distinct s from Student s left join s.user u " +
           "where (exists (select 1 from InternshipPlacement ip where ip.company.companyId = :companyId and ip.student = s) " +
           "or exists (select 1 from InternshipApplication ia where ia.taxCode = :companyCode and ia.student = s)) " +
           "and (:search is null or :search = '' or " +
           "lower(u.fullName) like lower(concat('%', :search, '%')) or " +
           "lower(u.email) like lower(concat('%', :search, '%')) or " +
           "lower(s.studentCode) like lower(concat('%', :search, '%')) or " +
           "cast(s.studentId as string) like concat('%', :search, '%'))")
    Page<Student> findStudentsByCompanyIdOrTaxCodeWithSearch(@Param("companyId") Long companyId, @Param("companyCode") String companyCode, @Param("search") String search, Pageable pageable);

    @Query("select distinct s from Student s left join s.user u " +
           "where (exists (select 1 from InternshipPlacement ip where ip.mentor.mentorId = :mentorId and ip.student = s) " +
           "or exists (select 1 from InternshipAssignment ia join ia.students ast where ia.mentor.mentorId = :mentorId and ast = s)) " +
           "and (:search is null or :search = '' or " +
           "lower(u.fullName) like lower(concat('%', :search, '%')) or " +
           "lower(u.email) like lower(concat('%', :search, '%')) or " +
           "lower(s.studentCode) like lower(concat('%', :search, '%')) or " +
           "cast(s.studentId as string) like concat('%', :search, '%'))")
    Page<Student> findStudentsByMentorPlacementWithSearch(@Param("mentorId") Long mentorId, @Param("search") String search, Pageable pageable);
}
