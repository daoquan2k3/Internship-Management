package pka.edu.repository;

import pka.edu.entity.User;
import pka.edu.util.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    @Query("SELECT u FROM User u WHERE u.username = :username")
    Optional<User> findByUsername(@Param("username") String username);

    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isDeleted = false AND u.isActive = true")
    Optional<User> findByEmailAndIsDeletedFalseAndIsActiveTrue(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE u.username = :username AND u.isDeleted = false AND u.isActive = true")
    Optional<User> findByUsernameAndIsDeletedFalseAndIsActiveTrue(@Param("username") String username);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN TRUE ELSE FALSE END FROM User u WHERE u.username = :username AND u.isDeleted = false AND u.isActive = true")
    boolean existsByUsernameAndIsDeletedFalseAndIsActiveTrue(@Param("username") String username);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN TRUE ELSE FALSE END FROM User u WHERE u.email = :email AND u.isDeleted = false AND u.isActive = true")
    boolean existsByEmailAndIsDeletedFalseAndIsActiveTrue(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE u.userId = :userId AND u.isDeleted = false AND u.isActive = true")
    Optional<User> findByUserIdAndIsDeletedFalseAndIsActiveTrue(@Param("userId") Long userId);

    @Query("SELECT u FROM User u WHERE u.userId = :userId AND u.isDeleted = false")
    Optional<User> findByUserIdAndIsDeletedFalse(@Param("userId") Long userId);

    @Query("SELECT u FROM User u WHERE u.isDeleted = false AND u.isActive = true")
    Page<User> findAllByIsDeletedFalseAndIsActiveTrue(Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.isDeleted = false AND u.isActive = true")
    Page<User> findByRoleAndIsDeletedFalseAndIsActiveTrue(@Param("role") Role role, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role IN :roles AND u.isDeleted = false AND u.isActive = true")
    Page<User> findByRoleInAndIsDeletedFalseAndIsActiveTrue(@Param("roles") List<Role> roles, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.university.universityId = :universityId AND u.isDeleted = false AND u.isActive = true")
    Page<User> findByRoleAndUniversity_UniversityIdAndIsDeletedFalseAndIsActiveTrue(@Param("role") Role role, @Param("universityId") Long universityId, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.university.universityId = :universityId AND u.isDeleted = false AND u.isActive = true")
    List<User> findAllByRoleAndUniversity_UniversityIdAndIsDeletedFalseAndIsActiveTrue(@Param("role") Role role, @Param("universityId") Long universityId);

    @Query("SELECT u FROM User u WHERE u.university.universityId = :universityId AND u.isDeleted = false AND u.isActive = true")
    Page<User> findAllByUniversity_UniversityIdAndIsDeletedFalseAndIsActiveTrue(@Param("universityId") Long universityId, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.company.companyId = :companyId AND u.isDeleted = false AND u.isActive = true")
    Page<User> findByRoleAndCompany_CompanyIdAndIsDeletedFalseAndIsActiveTrue(@Param("role") Role role, @Param("companyId") Long companyId, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.company.companyId = :companyId AND u.isDeleted = false AND u.isActive = true")
    Page<User> findAllByCompany_CompanyIdAndIsDeletedFalseAndIsActiveTrue(@Param("companyId") Long companyId, Pageable pageable);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN TRUE ELSE FALSE END FROM User u WHERE u.username = :username AND u.userId <> :id AND u.isDeleted = false AND u.isActive = true")
    boolean existsByUsernameAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(@Param("username") String username, @Param("id") Long id);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN TRUE ELSE FALSE END FROM User u WHERE u.email = :email AND u.userId <> :id AND u.isDeleted = false AND u.isActive = true")
    boolean existsByEmailAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(@Param("email") String email, @Param("id") Long id);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") Role role);

    @Query("select count(s) from User s where s.student.studentId in " +
            "(select st.studentId from InternshipAssignment ia join ia.students st where ia.mentor.mentorId = :mentorId)")
    long countStudentsByMentorId(Long mentorId);

    @Query("SELECT u FROM User u LEFT JOIN u.university uni LEFT JOIN u.company comp " +
        "WHERE u.isDeleted = false AND u.isActive = true " +
        "AND (:role IS NULL OR u.role = :role) " +
        "AND (:uniId IS NULL OR uni.universityId = :uniId) " +
        "AND (:compId IS NULL OR comp.companyId = :compId OR (u.role = 'ROLE_STUDENT' AND EXISTS (SELECT 1 FROM InternshipPlacement ip WHERE ip.company.companyId = :compId AND ip.student = u.student))) " +
        "AND (:search IS NULL OR :search = '' OR " +
        "LOWER(uni.universityName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
        "LOWER(comp.companyName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
        "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
        "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
        "LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> searchUsers(@Param("role") Role role, @Param("uniId") Long uniId, @Param("compId") Long compId, @Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM User u LEFT JOIN u.university uni LEFT JOIN u.company comp " +
           "WHERE u.isDeleted = false AND u.isActive = true " +
           "AND u.role IN :roles " +
           "AND (:uniId IS NULL OR uni.universityId = :uniId) " +
           "AND (:compId IS NULL OR comp.companyId = :compId) " +
           "AND (:search IS NULL OR :search = '' OR " +
           "LOWER(uni.universityName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(comp.companyName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> searchUsersInRoles(@Param("roles") List<Role> roles, @Param("uniId") Long uniId, @Param("compId") Long compId, @Param("search") String search, Pageable pageable);
}
