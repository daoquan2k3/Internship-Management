package pka.edu.mapper;

import pka.edu.dto.request.StudentCreateRequest;
import pka.edu.dto.request.StudentUpdateRequest;
import pka.edu.dto.response.StudentResponse;
import pka.edu.entity.Student;
import pka.edu.exception.ResourceBadRequestException;

public class StudentMapper {
    public static StudentResponse toDto(Student student) {
        return StudentResponse.builder()
                .studentId(student.getStudentId())
                .studentCode(student.getStudentCode())
                .major(student.getMajor())
                .classRoom(student.getClassRoom())
                .dateOfBirth(student.getDateOfBirth())
                .avatarUrl(student.getUser().getAvatarUrl())
                .address(student.getAddress())
                .fullName(student.getUser().getFullName())
                .email(student.getUser().getEmail())
                .phoneNumber(student.getUser().getPhoneNumber())
                .build();
    }

    public static void toEntity(Student entity, StudentCreateRequest student) throws ResourceBadRequestException {
        entity.setStudentCode(student.getStudentCode());
        entity.setMajor(student.getMajor());
        entity.setClassRoom(student.getClassRoom());
        entity.setDateOfBirth(student.getDateOfBirth());
        entity.setAddress(student.getAddress());
    }


    public static void updateFromDto(Student student, StudentUpdateRequest request) throws ResourceBadRequestException {
        if (request.getStudentCode() != null) {
            student.setStudentCode(request.getStudentCode());
        }
        if (request.getMajor() != null) {
            student.setMajor(request.getMajor());
        }
        if (request.getClassRoom() != null) {
            student.setClassRoom(request.getClassRoom());
        }
        if (request.getAddress() != null) {
            student.setAddress(request.getAddress());
        }
        if (request.getDateOfBirth() != null) {
            student.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getFullName() != null) {
            student.getUser().setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            student.getUser().setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            student.getUser().setPhoneNumber(request.getPhoneNumber());
        }
    }
}
