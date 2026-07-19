package pka.edu.mapper;

import pka.edu.dto.request.MentorCreateRequest;
import pka.edu.dto.request.MentorUpdateRequest;
import pka.edu.dto.response.MentorPublicResponse;
import pka.edu.dto.response.MentorResponse;
import pka.edu.entity.Mentor;

public class MentorMapper {
    public static MentorResponse toDto(Mentor mentor){
        return MentorResponse.builder()
                .id(mentor.getMentorId())
                .department(mentor.getDepartment())
                .academicRank(mentor.getAcademicRank())
                .fullName(mentor.getUser().getFullName())
                .email(mentor.getUser().getEmail())
                .phoneNumber(mentor.getUser().getPhoneNumber())
                .avatarUrl(mentor.getUser().getAvatarUrl())
                .build();
    }

    public static MentorPublicResponse toPublicDto(Mentor mentor){
        return MentorPublicResponse.builder()
                .id(mentor.getMentorId()) 
                .department(mentor.getDepartment())
                .academicRank(mentor.getAcademicRank())
                .fullName(mentor.getUser().getFullName())
                .avatarUrl(mentor.getUser().getAvatarUrl())
                .build();
    }

    public static Mentor toEntity(MentorCreateRequest request){
        return Mentor.builder()
                .department(request.getDepartment())
                .academicRank(request.getAcademicRank())
                .build();
    }

    public static void updateFromDto(Mentor mentor, MentorUpdateRequest request){
        if (request.getDepartment() != null) {
            mentor.setDepartment(request.getDepartment());
        }
        if (request.getAcademicRank() != null) {
            mentor.setAcademicRank(request.getAcademicRank());
        }
        if (request.getFullName() != null) {
            mentor.getUser().setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            mentor.getUser().setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            mentor.getUser().setPhoneNumber(request.getPhoneNumber());
        }
    }
}
