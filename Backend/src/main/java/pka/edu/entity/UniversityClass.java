package pka.edu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "university_classes")
public class UniversityClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long classId;

    @Column(nullable = false)
    private String className;

    @Column
    private String academicYear;

    @Column
    private String semester; // VD: HK1, HK2, HK3

    @Column
    private Integer maxStudents = 50;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", nullable = false)
    private University university;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher; // The user with ROLE_TEACHER

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "class_student_mapping",
            joinColumns = @JoinColumn(name = "class_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private List<Student> students;

    @Column(nullable = false)
    private boolean isActive = true;

    @OneToMany(mappedBy = "universityClass", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InternshipApplication> applications;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
