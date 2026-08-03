package pka.edu.service;

import pka.edu.dto.request.InternshipApplicationRequest;
import pka.edu.dto.request.UpdateCompanyInfoRequest;
import pka.edu.dto.request.UpdateInternshipApplicationRequest;
import pka.edu.dto.response.InternshipApplicationResponse;
import pka.edu.dto.response.PageResponseDTO;
import org.springframework.data.domain.Pageable;
import pka.edu.exception.ResourceForbiddenException;

public interface InternshipApplicationService {
    InternshipApplicationResponse submitApplication(InternshipApplicationRequest request, Long studentId);
    InternshipApplicationResponse updateCompanyInfo(Long applicationId, UpdateCompanyInfoRequest request, Long studentId);
    InternshipApplicationResponse updateConditions(Long applicationId, UpdateInternshipApplicationRequest request, Long teacherId);
    InternshipApplicationResponse approveApplication(Long applicationId, Long teacherId);
    InternshipApplicationResponse rejectApplication(Long applicationId, Long userId, pka.edu.dto.request.RejectApplicationRequest request);
    PageResponseDTO<InternshipApplicationResponse> getApplicationsByClass(Long classId, String status, Pageable pageable) throws ResourceForbiddenException;
    PageResponseDTO<InternshipApplicationResponse> getMyApplications(Long studentUserId, Pageable pageable);
    PageResponseDTO<InternshipApplicationResponse> getApplicationsByCompany(Long companyRepId, Pageable pageable) throws ResourceForbiddenException;
    java.util.List<pka.edu.entity.Company> getAllCompanies();
}
