package pka.edu.repository;

import pka.edu.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface INotificationRepository extends JpaRepository<Notification, Long> {

    @Query("select n from Notification n where n.user.userId = :userId and " +
            "(:keyword is null or :keyword = '' or lower(n.message) like lower(concat('%', :keyword, '%')))" +
            "order by n.createdAt desc")
    Page<Notification> findByUser_UserIdOrderByCreatedAtDesc(@Param("userId") Long userId,
                                                             @Param("keyword") String keyword,
                                                             Pageable pageable);

    @Modifying
    @Transactional
    @Query("update Notification n set n.isRead = true where n.user.userId = :userId and n.isRead = false")
    void markAllAsReadByUserId(@Param("userId") Long userId);
}
