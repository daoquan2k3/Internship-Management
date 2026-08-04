package pka.edu.repository;

import pka.edu.entity.InternshipAssignment;
import pka.edu.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface InternshipAssignmentRepository extends JpaRepository<InternshipAssignment, Long> {



    @Query("select case when count(ia) > 0 then true else false end from InternshipAssignment ia " +
            "where ia.mentor.mentorId = :mentorId and ia.assignmentId = :assignmentId")
    boolean existsByMentor_MentorIdAndAssignmentId(@Param("mentorId") Long mentorId, @Param("assignmentId") Long assignmentId);

    // Sử dụng DISTINCT để kết quả phân trang không bị lặp khi JOIN
    @Query("select distinct ia from InternshipAssignment ia " +
            "left join ia.students s " +
            "where ia.mentor.mentorId = :mentorId and ( " +
            ":search is null or :search = '' or " +
            "lower(cast(ia.status as string )) like lower(concat('%', :search, '%')) or " +
            "lower(ia.assignmentTitle) like lower(concat('%', :search, '%')) or " +
            "lower(ia.mentor.user.fullName) like lower(concat('%', :search, '%')) or " +
            "lower(s.user.fullName) like lower(concat('%', :search, '%')))")
    Page<InternshipAssignment> findByMentorIdAndKeyword(@Param("search") String search, @Param("mentorId") Long mentorId, Pageable pageable);

    @Query("select distinct ia from InternshipAssignment ia " +
            "join ia.students st " +
            "left join ia.students s " +
            "where st.studentId = :studentId and ( " +
            ":search is null or :search = '' or " +
            "lower(cast(ia.status as string )) like lower(concat('%', :search, '%')) or " +
            "lower(ia.assignmentTitle) like lower(concat('%', :search, '%')) or " +
            "lower(ia.mentor.user.fullName) like lower(concat('%', :search, '%')) or " +
            "lower(s.user.fullName) like lower(concat('%', :search, '%')))")
    Page<InternshipAssignment> findByStudentIdAndKeyword(@Param("search") String search, @Param("studentId") Long studentId, Pageable pageable);

    @Query("select distinct ia from InternshipAssignment ia " +
            "left join ia.students s " +
            "where " +
            ":search is null or :search = '' or " +
            "lower(cast(ia.status as string )) like lower(concat('%', :search, '%')) or " +
            "lower(ia.assignmentTitle) like lower(concat('%', :search, '%')) or " +
            "lower(ia.mentor.user.fullName) like lower(concat('%', :search, '%')) or " +
            "lower(s.user.fullName) like lower(concat('%', :search, '%'))")
    Page<InternshipAssignment> findAllByKeyword(@Param("search") String search, Pageable pageable);

    @Query("select distinct ia from InternshipAssignment ia " +
            "left join ia.students s " +
            "where ia.mentor.user.company.companyId = :companyId and ( " +
            ":search is null or :search = '' or " +
            "lower(cast(ia.status as string )) like lower(concat('%', :search, '%')) or " +
            "lower(ia.assignmentTitle) like lower(concat('%', :search, '%')) or " +
            "lower(ia.mentor.user.fullName) like lower(concat('%', :search, '%')) or " +
            "lower(s.user.fullName) like lower(concat('%', :search, '%')))")
    Page<InternshipAssignment> findByCompanyIdAndKeyword(@Param("search") String search, @Param("companyId") Long companyId, Pageable pageable);

    Optional<InternshipAssignment> findByAssignmentIdAndMentor_MentorId(Long assignmentId, Long mentorId);

    Optional<InternshipAssignment> findByAssignmentIdAndMentor_User_Company_CompanyId(Long assignmentId, Long companyId);

    @Query("select ia from InternshipAssignment ia join ia.students s where ia.assignmentId = :assignmentId and s.studentId = :studentId")
    Optional<InternshipAssignment> findByAssignmentIdAndStudentId(@Param("assignmentId") Long assignmentId, @Param("studentId") Long studentId);

    @Query("select distinct ia from InternshipAssignment ia " +
            "join ia.students st " +
            "left join ia.students s " +
            "where st.studentId = :studentId and ( " +
            ":search is null or :search = '' or " +
            "lower(cast(ia.status as string )) like lower(concat('%', :search, '%')) or " +
            "lower(ia.assignmentTitle) like lower(concat('%', :search, '%')) or " +
            "lower(ia.mentor.user.fullName) like lower(concat('%', :search, '%')) or " +
            "lower(s.user.fullName) like lower(concat('%', :search, '%')))")
    Page<InternshipAssignment> findByStudent_StudentId(@Param("search") String search,
                                                       @Param("studentId") Long studentId,
                                                       Pageable pageable);

    @Query("select case when count(ia) > 0 then true else false end from InternshipAssignment ia " +
            "join ia.students s " +
            "where s.studentId = :studentId and ia.assignmentId = :assignmentId")
    boolean existsByStudentIdAndAssignmentId(@Param("studentId") Long studentId, @Param("assignmentId") Long assignmentId);

    @Query("select s from Student s " +
            "where exists (select 1 from InternshipAssignment ia join ia.students ias where ia.mentor.mentorId = :mentorId and ias = s)")
    Page<Student> findStudentsByMentorId(@Param("mentorId") Long mentorId,
                                         Pageable pageable);

    @Query("select s from Student s left join s.user u " +
            "where exists (select 1 from InternshipAssignment ia join ia.students ias where ia.mentor.mentorId = :mentorId and ias = s) " +
            "and (:search is null or :search = '' or " +
            "lower(u.fullName) like lower(concat('%', :search, '%')) or " +
            "lower(u.email) like lower(concat('%', :search, '%')) or " +
            "lower(s.studentCode) like lower(concat('%', :search, '%')) or " +
            "cast(s.studentId as string) like concat('%', :search, '%'))")
    Page<Student> findStudentsByMentorIdWithSearch(@Param("mentorId") Long mentorId, @Param("search") String search, Pageable pageable);

    long countByMentor_MentorId(Long mentorId);

    @Query("SELECT COUNT(ia) FROM InternshipAssignment ia JOIN ia.students s WHERE s.studentId = :studentId")
    long countTotalAssignmentsByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(ia) FROM InternshipAssignment ia JOIN ia.students s WHERE s.studentId = :studentId AND ia.status = 'COMPLETED'")
    long countCompletedAssignmentsByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(ia) FROM InternshipAssignment ia JOIN ia.students s " +
            "WHERE s.studentId = :studentId " +
            "AND ia.status != 'COMPLETED' " +
            "AND ia.dueDate >= :today AND ia.dueDate <= :nextWeek")
    long countUpcomingDeadlinesByStudentId(@Param("studentId") Long studentId,
                                           @Param("today") LocalDate today,
                                           @Param("nextWeek") LocalDate nextWeek);
}