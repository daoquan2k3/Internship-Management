package pka.edu.dto.request;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserCreateRequest {
    @Pattern(regexp = "^(|[a-zA-Z0-9_]+)$", message = "Username can only contain letters, numbers, and underscores")
    @NotBlank(message = "Username is required")
    private String username;

    @Pattern(regexp = "^(|(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+=-]).{8,})$", message = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character")
    @NotBlank(message = "Password is required")
    private String password;

    @Pattern(regexp = "^(|[\\p{L}0-9]+( [\\p{L}0-9]+)*)$", message = "Full name can only contain letters, numbers and separated by single spaces")
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email is invalid")
    private String email;

    @Pattern(regexp = "^(|0[356789]\\d{8})$", message = "Invalid phone number. Phone number must be 10 digits and start with '0'.")
    private String phoneNumber;

    @NotBlank(message = "Role is required")
    private String role;

    // Optional fields for Student
    private String studentCode;
    public String major;
    private String classRoom;
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Past(message = "Date of birth must be in the past")
    public LocalDate dateOfBirth;
    private String address;

    // Optional fields for Professional Profile (Mentor Entity)
    private String department;
    private String academicRank;
    private String position;
    
    private Long universityId;
    private Long companyId;
}
