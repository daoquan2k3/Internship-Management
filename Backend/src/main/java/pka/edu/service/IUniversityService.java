package pka.edu.service;

import pka.edu.dto.request.UniversityRequest;
import pka.edu.dto.response.UniversityResponse;
import pka.edu.dto.response.PageResponseDTO;
import org.springframework.data.domain.Pageable;

public interface IUniversityService {
    UniversityResponse createUniversity(UniversityRequest request);
    PageResponseDTO<UniversityResponse> getAllUniversities(String search, Pageable pageable);
    UniversityResponse getUniversityById(Long id);
    UniversityResponse updateUniversity(Long id, UniversityRequest request);
    void deleteUniversity(Long id);
}
