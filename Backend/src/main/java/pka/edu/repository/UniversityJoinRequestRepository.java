package pka.edu.repository;

import pka.edu.entity.UniversityJoinRequest;
import pka.edu.util.enums.JoinRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversityJoinRequestRepository extends JpaRepository<UniversityJoinRequest, Long> {
    @Query("SELECT r FROM UniversityJoinRequest r WHERE r.university.universityId = :universityId")
    Page<UniversityJoinRequest> findByUniversity_UniversityId(@Param("universityId") Long universityId,
            Pageable pageable);

    @Query("SELECT r FROM UniversityJoinRequest r WHERE r.university.universityId = :universityId AND r.status = :status")
    Page<UniversityJoinRequest> findByUniversity_UniversityIdAndStatus(@Param("universityId") Long universityId,
            @Param("status") JoinRequestStatus status, Pageable pageable);

    @Query("SELECT r FROM UniversityJoinRequest r WHERE r.user.userId = :studentId")
    Page<UniversityJoinRequest> findByStudent_StudentId(@Param("studentId") Long studentId, Pageable pageable);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN TRUE ELSE FALSE END FROM UniversityJoinRequest r WHERE r.user.userId = :userId AND r.university.universityId = :universityId AND r.status = :status")
    boolean existsByUser_UserIdAndUniversity_UniversityIdAndStatus(@Param("userId") Long userId,
            @Param("universityId") Long universityId, @Param("status") JoinRequestStatus status);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN TRUE ELSE FALSE END FROM UniversityJoinRequest r WHERE r.user.userId = :userId AND r.status = :status")
    boolean existsByUser_UserIdAndStatus(@Param("userId") Long userId, @Param("status") JoinRequestStatus status);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN TRUE ELSE FALSE END FROM UniversityJoinRequest r WHERE r.universityStudentId = :universityStudentId AND r.status = :status AND r.user.userId != :userId")
    boolean existsByUniversityStudentIdAndStatusAndUser_UserIdNot(
            @Param("universityStudentId") String universityStudentId, @Param("status") JoinRequestStatus status,
            @Param("userId") Long userId);

    long countByUniversity_UniversityIdAndStatus(Long universityId, JoinRequestStatus status);
}
