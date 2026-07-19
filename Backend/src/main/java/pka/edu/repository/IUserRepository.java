package pka.edu.repository;

import pka.edu.entity.User;
import pka.edu.util.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);

    Optional<User> findByEmailAndIsDeletedFalseAndIsActiveTrue(String email);

    Optional<User> findByUsernameAndIsDeletedFalseAndIsActiveTrue(String username);

    boolean existsByUsernameAndIsDeletedFalseAndIsActiveTrue(String username);

    boolean existsByEmailAndIsDeletedFalseAndIsActiveTrue(String email);

    Optional<User> findByUserIdAndIsDeletedFalseAndIsActiveTrue(Long userId);

    Optional<User> findByUserIdAndIsDeletedFalse(Long userId);

    Page<User> findAllByIsDeletedFalseAndIsActiveTrue(Pageable pageable);

    Page<User> findByRoleAndIsDeletedFalseAndIsActiveTrue(Role role, Pageable pageable);

    boolean existsByUsernameAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(String username, Long id);

    boolean existsByEmailAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(String email, Long id);

    long countByRole(Role role);

    @Query("select count(s) from User s where s.student.studentId in " +
            "(select st.studentId from InternshipAssignment ia join ia.students st where ia.mentor.mentorId = :mentorId)")
    long countStudentsByMentorId(Long mentorId);
}
