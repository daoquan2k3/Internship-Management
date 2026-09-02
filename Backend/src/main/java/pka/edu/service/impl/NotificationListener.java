package pka.edu.service.impl;

import pka.edu.entity.User;
import pka.edu.event.NotificationEventDTO;
import pka.edu.repository.UserRepository;
import pka.edu.service.IEmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationListener {

    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final IEmailService emailService;

    @RabbitListener(queues = "${rabbitmq.queue.notification}")
    public void handleNotificationEvent(NotificationEventDTO eventDTO) {
        log.info("Đã nhận được thông báo từ RabbitMQ: {}", eventDTO.getMessage());

        try {
            User recipient = userRepository.findById(eventDTO.getRecipientId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy User nhận thông báo"));

            notificationService.createNotification(recipient, eventDTO.getMessage(), eventDTO.getType());

            log.info("Lưu thông báo vào Database thành công!");

            // Send email
            if (recipient.getEmail() != null && !recipient.getEmail().isEmpty()) {
                String subject = eventDTO.getTitle() != null ? eventDTO.getTitle() : "Thông báo mới từ hệ thống Internship PKA";
                String body = eventDTO.getEmailContent() != null ? eventDTO.getEmailContent() : eventDTO.getMessage();
                emailService.sendEmail(recipient.getEmail(), subject, body);
                log.info("Đã gửi email thông báo thành công tới: {}", recipient.getEmail());
            }

        } catch (Exception e) {
            log.error("Lỗi khi xử lý thông báo từ RabbitMQ: ", e);
        }
    }
}
