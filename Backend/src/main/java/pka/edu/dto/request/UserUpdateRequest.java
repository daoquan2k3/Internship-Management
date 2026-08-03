package pka.edu.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserUpdateRequest {
    @Pattern(regexp = "^(|[a-zA-Z0-9_]+)$", message = "Username can only contain letters, numbers, and underscores")
    private String username;

    @Pattern(regexp = "^(|[\\p{L}0-9]+( [\\p{L}0-9]+)*)$", message = "Full name must contain only letters and numbers, and cannot have leading or trailing spaces")
    private String fullName;

    @Email(message = "Email is not valid")
    private String email;

    @Pattern(regexp = "^(|0[356789]\\d{8})$", message = "Phone number must be 10 digits and start with '0'")
    private String phoneNumber;

    private String role;

    // Optional fields for Student
    private String studentCode;
    public String major;
    private String classRoom;
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    @jakarta.validation.constraints.Past(message = "Date of birth must be in the past")
    public java.time.LocalDate dateOfBirth;
    private String address;

    // Optional fields for Professional Profile (Mentor Entity)
    private String department;
    private String academicRank;
    private String position;
    
    private Long universityId;
    private Long companyId;
    
    // External Mentor info
    private String externalMentorName;
    private String externalMentorPhone;
}
