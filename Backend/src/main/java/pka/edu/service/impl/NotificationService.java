package pka.edu.service.impl;

import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.NotificationResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.entity.Notification;
import pka.edu.entity.User;
import pka.edu.mapper.NotificationMapper;
import pka.edu.repository.INotificationRepository;
import pka.edu.util.CurrentUserUtil;
import pka.edu.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final INotificationRepository notificationRepository;
    private final CurrentUserUtil currentUserUtil;

    public void createNotification(User recipient, String message, String type) {
        Notification notification = Notification.builder()
                .user(recipient)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    public PageResponseDTO<NotificationResponse> getMyNotifications(String search, PageRequestDTO pageRequestDTO) {
        Long userId = currentUserUtil.getCurrentUser().getUserId();

        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "notification");

        Page<Notification> notificationPage = notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId, search, pageable);

        return PaginationUtil.toPageResponseDTO(notificationPage, NotificationMapper::toDTO);
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }

    @Transactional
    public void markAllAsRead() {
        Long userId = currentUserUtil.getCurrentUser().getUserId();
        notificationRepository.markAllAsReadByUserId(userId);
    }
}
