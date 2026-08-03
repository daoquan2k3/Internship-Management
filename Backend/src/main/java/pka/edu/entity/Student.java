package pka.edu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Student {
    @Id
    private Long studentId;

    @Column(nullable = false, unique = true)
    private String studentCode;

    private String major;

    private String classRoom;

    private LocalDate dateOfBirth;

    private String address;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @org.hibernate.annotations.Formula("(SELECT COALESCE(c.company_name, ia.company_name) FROM internship_applications ia LEFT JOIN companies c ON ia.company_id = c.company_id WHERE ia.student_id = student_id AND ia.status = 'APPROVED' LIMIT 1)")
    private String internshipCompany;

    @Column(name = "external_mentor_name")
    private String externalMentorName;

    @Column(name = "external_mentor_phone")
    private String externalMentorPhone;

    @OneToOne
    @MapsId // Đảm bảo studentId và userId là cùng một giá trị
    @JoinColumn(name = "student_id")
    private User user;
}
