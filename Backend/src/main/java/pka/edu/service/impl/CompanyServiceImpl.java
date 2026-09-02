package pka.edu.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pka.edu.dto.request.CompanyCreateRequest;
import pka.edu.dto.request.CompanyUpdateRequest;
import pka.edu.dto.response.CompanyResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.entity.Company;
import pka.edu.entity.User;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.mapper.CompanyMapper;
import pka.edu.repository.CompanyRepository;
import pka.edu.repository.UserRepository;
import pka.edu.service.ICompanyService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyServiceImpl implements ICompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    @Override
    public PageResponseDTO<CompanyResponse> searchCompanies(String search, Pageable pageable) {
        String safeSearch = (search == null) ? "" : search;
        Page<Company> companyPage = companyRepository.searchCompanies(safeSearch, pageable);
        List<CompanyResponse> content = companyPage.getContent().stream()
                .map(CompanyMapper::toDto)
                .collect(Collectors.toList());

        return PageResponseDTO.<CompanyResponse>builder()
                .content(content)
                .page(companyPage.getNumber())
                .size(companyPage.getSize())
                .totalElements(companyPage.getTotalElements())
                .totalPages(companyPage.getTotalPages())
                .hasNext(companyPage.hasNext())
                .hasPrevious(companyPage.hasPrevious())
                .build();
    }

    @Override
    public CompanyResponse getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        return CompanyMapper.toDto(company);
    }

    @Override
    @Transactional
    public CompanyResponse createCompany(CompanyCreateRequest request) {
        if (companyRepository.existsByCompanyCode(request.getCompanyCode())) {
            throw new ResourceConflictException("Company code already exists");
        }

        Company company = CompanyMapper.toEntity(request);
        
        // Cấp quyền Verify mặc định nếu người tạo là ADMIN
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername).orElse(null);
        if (currentUser != null && currentUser.getRole().name().equals("ROLE_ADMIN")) {
            company.setVerified(true);
        }

        company = companyRepository.save(company);
        return CompanyMapper.toDto(company);
    }

    @Override
    @Transactional
    public CompanyResponse updateCompany(Long id, CompanyUpdateRequest request) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
                
        CompanyMapper.updateFromDto(company, request);
        company = companyRepository.save(company);
        return CompanyMapper.toDto(company);
    }

    @Override
    @Transactional
    public void deleteCompany(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        company.setDeleted(true);
        companyRepository.save(company);
    }
}
