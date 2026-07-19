package pka.edu.repository;

import pka.edu.entity.Student;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IStudentRepository extends JpaRepository<Student, Long> {

    boolean existsByStudentCode(String studentCode);
    boolean existsByStudentCodeAndStudentIdNot(String studentCode, Long studentId);

    @Query("select s from Student s where s.studentId = :studentId and s.user.isDeleted = false and s.user.isActive = true")
    Optional<Student> findByStudentId(@Param("studentId") Long studentId);

    @Query("select s from Student s where s.user.userId = :userId and s.user.isDeleted = false and s.user.isActive = true")
    Optional<Student> findByUser_UserId(@Param("userId") Long userId);

    @Query("select s from Student s where s.user.isDeleted = false and s.user.isActive = true")
    Page<Student> findAllStudents(Pageable pageable);

    @Query("select s from Student s where s.studentId in :studentIds and s.user.isDeleted = false and s.user.isActive = true")
    List<Student> findAllByStudentId(@Param("studentIds") List<Long> studentIds);
}
