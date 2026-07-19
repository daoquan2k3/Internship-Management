package pka.edu.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import pka.edu.util.enums.AssignmentStatus;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InternshipAssignmentResponse {
    private Long id;
    private String assignmentTitle;
    private String assignmentDescription;
    private Long mentorId;
    private String mentorName;
    private String mentorAvatarUrl;
    private Long phaseId;
    private String phaseName;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dueDate;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate assignedDate;
    private AssignmentStatus status;

    private List<StudentBasicInfo> students;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class StudentBasicInfo {
        private Long id;
        private String name;
        private String code;
        private String major;
        private String avatarUrl;
    }
}