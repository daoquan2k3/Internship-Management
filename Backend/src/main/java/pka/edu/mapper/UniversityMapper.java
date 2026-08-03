package pka.edu.mapper;

import pka.edu.dto.request.UniversityRequest;
import pka.edu.dto.response.UniversityResponse;
import pka.edu.entity.University;

public class UniversityMapper {

    public static UniversityResponse toDto(University university) {
        if (university == null) {
            return null;
        }
        return UniversityResponse.builder()
                .universityId(university.getUniversityId())
                .name(university.getUniversityName())
                .address(university.getAddress())
                .contactEmail(university.getEmail())
                .build();
    }

    public static University toEntity(UniversityRequest request) {
        if (request == null) {
            return null;
        }
        University university = new University();
        university.setUniversityName(request.getName());
        university.setAddress(request.getAddress());
        university.setEmail(request.getContactEmail());
        return university;
    }
}
