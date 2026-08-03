package pka.edu.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentResponse {

    private Long studentId;

    private String fullName;

    private String email;

    private String phoneNumber;

    public String studentCode;

    private String avatarUrl;

    public String major;

    public String classRoom;

    @JsonFormat(pattern = "dd/MM/yyyy")
    public LocalDate dateOfBirth;

    public String address;
    
    private String internshipCompany;
    
    private String externalMentorName;
    
    private String externalMentorPhone;
}
