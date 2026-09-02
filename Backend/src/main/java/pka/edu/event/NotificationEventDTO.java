package pka.edu.event;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationEventDTO {
    private Long recipientId;
    private String title;
    private String message;
    private String type;
    private String emailContent; // Optional HTML content for the email
}
