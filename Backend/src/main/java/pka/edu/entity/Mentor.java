package pka.edu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Mentor {
    @Id
    private Long mentorId;

    @OneToOne
    @MapsId // Đảm bảo mentorId và userId là cùng một giá trị
    @JoinColumn(name = "mentor_id")
    private User user;

    private String department;
    private String academicRank;
    private String position;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
