package pka.edu.service;

import pka.edu.dto.request.CompanyCreateRequest;
import pka.edu.dto.request.CompanyUpdateRequest;
import pka.edu.dto.response.CompanyResponse;
import pka.edu.dto.response.PageResponseDTO;
import org.springframework.data.domain.Pageable;

public interface ICompanyService {
    PageResponseDTO<CompanyResponse> searchCompanies(String search, Pageable pageable);
    CompanyResponse getCompanyById(Long id);
    CompanyResponse createCompany(CompanyCreateRequest request);
    CompanyResponse updateCompany(Long id, CompanyUpdateRequest request);
    void deleteCompany(Long id);
}
