package pka.edu.service;

import pka.edu.dto.response.InternshipPlacementResponse;
import pka.edu.dto.response.PageResponseDTO;
import org.springframework.data.domain.Pageable;

public interface IInternshipPlacementService {
    InternshipPlacementResponse createPlacement(Long applicationId);
    InternshipPlacementResponse assignCompany(Long placementId, Long companyId);
    InternshipPlacementResponse assignMentor(Long placementId, Long mentorId);
    PageResponseDTO<InternshipPlacementResponse> getPlacementsByClass(Long classId, Pageable pageable);
    PageResponseDTO<InternshipPlacementResponse> getMyPlacements(Long studentUserId, Pageable pageable);
    PageResponseDTO<InternshipPlacementResponse> getPlacementsForCompany(Long companyUserId, Pageable pageable);
    PageResponseDTO<InternshipPlacementResponse> getPlacementsForMentor(Long mentorUserId, Pageable pageable);
}
