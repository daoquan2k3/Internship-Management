package pka.edu.mapper;

import pka.edu.dto.request.InternshipAssignmentCreateRequest;
import pka.edu.dto.response.InternshipAssignmentResponse;
import pka.edu.entity.InternshipAssignment;

import pka.edu.entity.Mentor;
import pka.edu.entity.Student;
import pka.edu.util.enums.AssignmentStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class InternshipAssignmentMapper {
    public static InternshipAssignmentResponse toDto(InternshipAssignment entity) {
        List<InternshipAssignmentResponse.StudentBasicInfo> studentInfos = new ArrayList<>();
        if (entity.getStudents() != null) {
            studentInfos = entity.getStudents().stream()
                    .map(s -> InternshipAssignmentResponse.StudentBasicInfo.builder()
                            .id(s.getStudentId())
                            .name(s.getUser().getFullName())
                            .code(s.getStudentCode())
                            .major(s.getMajor())
                            .avatarUrl(s.getUser().getAvatarUrl())
                            .build())
                    .toList();
        }
        return InternshipAssignmentResponse.builder()
                .id(entity.getAssignmentId())
                .assignmentTitle(entity.getAssignmentTitle())
                .assignmentDescription(entity.getAssignmentDescription())
                .mentorId(entity.getMentor().getMentorId())
                .mentorName(entity.getMentor().getUser().getFullName())
                .mentorAvatarUrl(entity.getMentor().getUser().getAvatarUrl())
                .assignedDate(entity.getAssignedDate())
                .status(entity.getStatus())
                .students(studentInfos)
                .dueDate(entity.getDueDate())
                .build();
    }

    public static InternshipAssignment toEntity(InternshipAssignmentCreateRequest request, List<Student> students, Mentor mentor) {
        return InternshipAssignment.builder()
                .assignmentTitle(request.getAssignmentTitle())
                .assignmentDescription(request.getAssignmentDescription())
                .students(students)
                .mentor(mentor)
                .assignedDate(LocalDateTime.now().toLocalDate())
                .status(AssignmentStatus.PENDING)
                .dueDate(request.getDueDate())
                .build();
    }

}
