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
@Table(name = "universities")
public class University {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long universityId;

    @Column(nullable = false, unique = true)
    private String universityCode;

    @Column(nullable = false)
    private String universityName;

    private String address;

    private String email;

    private String phoneNumber;

    private String logoUrl;

    private String websiteUrl;

    @Column(nullable = false)
    private boolean isActive = true;

    private boolean isDeleted = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
