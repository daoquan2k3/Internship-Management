package pka.edu.service;

import pka.edu.dto.request.UniversityJoinRequestRequest;
import pka.edu.dto.request.UpdateJoinRequestStatusRequest;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.dto.response.UniversityJoinRequestResponse;
import org.springframework.data.domain.Pageable;
import pka.edu.exception.ResourceForbiddenException;

public interface IUniversityJoinRequestService {
    UniversityJoinRequestResponse createRequest(UniversityJoinRequestRequest request, Long studentId);
    UniversityJoinRequestResponse updateStatus(Long requestId, UpdateJoinRequestStatusRequest request, Long universityRepId);
    PageResponseDTO<UniversityJoinRequestResponse> getRequestsByUniversity(Long universityId, String status, Pageable pageable) throws ResourceForbiddenException;
    PageResponseDTO<UniversityJoinRequestResponse> getMyRequests(Long studentUserId, Pageable pageable);
}
