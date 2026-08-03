package pka.edu.dto.response;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private Long userId;
    private String username;
    private String fullName;
    private String phoneNumber;
    private String email;
    private String role;
    private String avatarUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private StudentResponse student;
    private MentorResponse mentor;
    
    private Long universityId;
    private String universityName;
    private Long companyId;
    private String companyName;
}
