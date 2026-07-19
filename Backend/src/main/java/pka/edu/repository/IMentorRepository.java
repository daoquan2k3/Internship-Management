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
public interface IMentorRepository extends JpaRepository<Mentor, Long> {

    @Query("select m from Mentor m where m.user.isDeleted = false and m.user.isActive = true")
    Page<Mentor> findAllByMentor(Pageable pageable);

    @Query("select m from Mentor m where m.mentorId = :mentorId and m.user.isDeleted = false and m.user.isActive = true")
    Optional<Mentor> findByMentorId(@Param("mentorId") Long mentorId);

    @Query("select m from Mentor m where m.user.username = :username and m.user.isDeleted = false and m.user.isActive = true")
    Optional<Mentor> findByUser_Username(String username);
}
