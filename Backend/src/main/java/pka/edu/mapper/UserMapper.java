package pka.edu.mapper;

import pka.edu.dto.request.UserUpdateRequest;
import pka.edu.dto.response.UserResponse;
import pka.edu.entity.User;
import pka.edu.util.enums.Role;

public class UserMapper {
    public static UserResponse toDto(User users) {
        if (users == null) return null;
        UserResponse response = UserResponse.builder()
                .userId(users.getUserId())
                .username(users.getUsername())
                .fullName(users.getFullName())
                .email(users.getEmail())
                .role(users.getRole().name())
                .phoneNumber(users.getPhoneNumber())
                .avatarUrl(users.getAvatarUrl())
                .isActive(users.isActive())
                .createdAt(users.getCreatedAt())
                .updatedAt(users.getUpdatedAt())
                .build();

        if (users.getRole() == Role.ROLE_STUDENT && users.getStudent() != null) {
            response.setStudent(StudentMapper.toDto(users.getStudent()));
        } else if ((users.getRole() == Role.ROLE_MENTOR || users.getRole() == Role.ROLE_COMPANY_MENTOR) && users.getMentor() != null) {
            response.setMentor(MentorMapper.toDto(users.getMentor()));
        }
        
        if (users.getUniversity() != null) {
            response.setUniversityId(users.getUniversity().getUniversityId());
            response.setUniversityName(users.getUniversity().getUniversityName());
        }
        if (users.getCompany() != null) {
            response.setCompanyId(users.getCompany().getCompanyId());
            response.setCompanyName(users.getCompany().getCompanyName());
        }
        
        return response;
    }

    public static void updateFromDto(User users, UserUpdateRequest userUpdateRequest) {
        if (userUpdateRequest.getUsername() != null && !userUpdateRequest.getUsername().isBlank()) {
            users.setUsername(userUpdateRequest.getUsername());
        }
        if (userUpdateRequest.getFullName() != null && !userUpdateRequest.getFullName().isBlank()) {
            users.setFullName(userUpdateRequest.getFullName());
        }
        if (userUpdateRequest.getEmail() != null && !userUpdateRequest.getEmail().isBlank()) {
            users.setEmail(userUpdateRequest.getEmail());
        }
        if (userUpdateRequest.getPhoneNumber() != null && !userUpdateRequest.getPhoneNumber().isBlank()) {
            users.setPhoneNumber(userUpdateRequest.getPhoneNumber());
        }
        if (userUpdateRequest.getRole() != null && !userUpdateRequest.getRole().isBlank()) {
            users.setRole(Role.valueOf(userUpdateRequest.getRole()));
        }
    }
}
