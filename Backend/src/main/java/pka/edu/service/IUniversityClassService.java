package pka.edu.service;

import pka.edu.dto.request.UniversityClassRequest;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.dto.response.UniversityClassResponse;
import org.springframework.data.domain.Pageable;

public interface IUniversityClassService {
    UniversityClassResponse createClass(UniversityClassRequest request, Long universityRepId);
    UniversityClassResponse updateClass(Long classId, UniversityClassRequest request, Long universityRepId);
    UniversityClassResponse assignTeacher(Long classId, Long teacherId, Long universityRepId);
    PageResponseDTO<UniversityClassResponse> getClassesByUniversity(Long universityId, Pageable pageable);
    PageResponseDTO<UniversityClassResponse> getClassesByTeacher(Long teacherId, Pageable pageable);
    PageResponseDTO<UniversityClassResponse> getAllClasses(Pageable pageable);
    PageResponseDTO<UniversityClassResponse> getMyClasses(Long userId, Pageable pageable);
}
