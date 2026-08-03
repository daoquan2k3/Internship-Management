package pka.edu.repository;

import pka.edu.entity.Mentor;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MentorRepository extends JpaRepository<Mentor, Long> {

    @Query("select m from Mentor m where m.user.isDeleted = false and m.user.isActive = true")
    Page<Mentor> findAllByMentor(Pageable pageable);

    @Query("select m from Mentor m left join m.user u where u.isDeleted = false and u.isActive = true " +
           "and (:search is null or :search = '' or " +
           "lower(u.fullName) like lower(concat('%', :search, '%')) or " +
           "lower(u.email) like lower(concat('%', :search, '%')) or " +
           "lower(m.department) like lower(concat('%', :search, '%')) or " +
           "cast(m.mentorId as string) like concat('%', :search, '%'))")
    Page<Mentor> findAllByMentorWithSearch(@org.springframework.data.repository.query.Param("search") String search, Pageable pageable);

    @Query("select distinct m from Mentor m where m.user.isDeleted = false and m.user.isActive = true and " +
           "(m.user.role = pka.edu.util.enums.Role.ROLE_TEACHER or m.user.role = pka.edu.util.enums.Role.ROLE_COMPANY_MENTOR) and " +
           "(m in (select ia.mentor from InternshipAssignment ia join ia.students s where s.studentId = :studentId) " +
           "or m.user in (select uc.teacher from UniversityClass uc join uc.students s where s.studentId = :studentId)) " +
           "and (:search is null or :search = '' or " +
           "lower(m.user.fullName) like lower(concat('%', :search, '%')) or " +
           "lower(m.user.email) like lower(concat('%', :search, '%')) or " +
           "lower(m.department) like lower(concat('%', :search, '%')) or " +
           "cast(m.mentorId as string) like concat('%', :search, '%'))")
    Page<Mentor> findMentorsAssignedToStudentWithSearch(@org.springframework.data.repository.query.Param("studentId") Long studentId, @org.springframework.data.repository.query.Param("search") String search, Pageable pageable);

    @Query("select m from Mentor m where m.mentorId = :mentorId and m.user.isDeleted = false and m.user.isActive = true")
    Optional<Mentor> findByMentorId(@Param("mentorId") Long mentorId);

    @Query("select m from Mentor m where m.user.username = :username and m.user.isDeleted = false and m.user.isActive = true")
    Optional<Mentor> findByUser_Username(String username);
}
