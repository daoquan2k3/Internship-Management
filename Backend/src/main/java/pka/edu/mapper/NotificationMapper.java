package pka.edu.mapper;

import pka.edu.dto.response.NotificationResponse;
import pka.edu.entity.Notification;

public class NotificationMapper {
    public static NotificationResponse toDTO(Notification notification) {
        if (notification == null) return null;

        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
